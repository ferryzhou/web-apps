"""
sc2_summary -- turn raw StarCraft II replay bytes into a clean summary dict.

Runs identically under CPython and inside Pyodide. Depends only on the vendored
``mpyq`` and ``s2protocol`` subset shipped alongside it. All decoding here uses
s2protocol's VersionedDecoder streams (replay header, details, initdata), which
are stable across game builds, so a single recent protocol version decodes the
vast majority of replays. Build-specific game/message events are intentionally
not decoded yet (that arrives with the analytics tier).

Public API:
    summarize(replay_bytes: bytes) -> dict
"""

from io import BytesIO

import mpyq
from s2protocol import versions


# StarCraft II game loops run at 16 per game-second. Real elapsed time is
# compressed by the lobby game-speed factor; "Faster" (ladder default) is 1.4.
LOOPS_PER_GAME_SECOND = 16.0
SPEED_FACTORS = {0: 0.6, 1: 0.8, 2: 1.0, 3: 1.2, 4: 1.4}
SPEED_NAMES = {0: 'Slower', 1: 'Slow', 2: 'Normal', 3: 'Fast', 4: 'Faster'}

# Windows FILETIME epoch (1601-01-01) to Unix epoch, in seconds.
_FILETIME_UNIX_EPOCH = 11644473600


def _text(value):
    """Decode s2protocol bytes/str fields to a clean Python str."""
    if isinstance(value, bytes):
        try:
            return value.decode('utf-8')
        except UnicodeDecodeError:
            return value.decode('latin-1')
    return value if value is not None else ''


def _normalize_race(raw):
    """Map a (possibly localized) race string to Terran/Protoss/Zerg/Random."""
    race = _text(raw).strip()
    if not race:
        return 'Unknown'
    head = race[0].upper()
    return {'T': 'Terran', 'P': 'Protoss', 'Z': 'Zerg'}.get(head, race)


def _color_hex(color):
    """Convert a details m_color struct to an #RRGGBB hex string."""
    if not color:
        return None
    r = color.get('m_r', 0)
    g = color.get('m_g', 0)
    b = color.get('m_b', 0)
    return '#{0:02x}{1:02x}{2:02x}'.format(r & 0xFF, g & 0xFF, b & 0xFF)


def _filetime_to_iso(filetime, local_offset=0):
    """Convert a Windows FILETIME (100 ns ticks) to a UTC ISO-8601 string."""
    if not filetime:
        return None
    # Convert to a Unix timestamp; ignore the sub-second remainder.
    unix = filetime / 1e7 - _FILETIME_UNIX_EPOCH
    if unix <= 0:
        return None
    from datetime import datetime, timezone
    return datetime.fromtimestamp(unix, tz=timezone.utc).isoformat()


def _result_label(code):
    return {1: 'Win', 2: 'Loss'}.get(code, 'Unknown')


def _exact_build_available(base_build):
    """True when a protocol file for this exact build is vendored."""
    name = 'protocol{0:05d}.py'.format(base_build)
    return name in versions.list_all()


def _game_speed(archive, protocol, base_build):
    """Best-effort lobby game speed (index into SPEED_FACTORS). Defaults Faster.

    initData is decoded with the *build-specific* BitPackedDecoder, so we only
    trust it when the exact build's protocol is vendored -- decoding it with a
    mismatched protocol can silently yield garbage rather than raising.
    """
    if not _exact_build_available(base_build):
        return 4  # Faster (ladder default)
    try:
        raw = archive.read_file('replay.initData')
        init = protocol.decode_replay_initdata(raw)
        speed = init['m_syncLobbyState']['m_gameDescription']['m_gameSpeed']
        if speed in SPEED_FACTORS:
            return speed
    except Exception:
        pass
    return 4  # Faster (ladder default)


# Food/supply is stored as a 4096x fixed-point integer in the score data.
_SUPPLY_FIXED_POINT = 4096

# Spawned/temporary units that just add noise to a build order.
_BUILD_NOISE = (
    'larva', 'egg', 'broodling', 'locust', 'interceptor', 'cocoon',
    'creeptumor', 'autoturret', 'infestedterran', 'mothershipcore.',
)
# Non-meaningful "upgrades" (emote sprays, decals, internal flags).
_UPGRADE_NOISE = ('spray', 'decal', 'mount', 'skin')

# Per-player build-order entries are capped so the payload stays small.
_BUILD_ORDER_LIMIT = 45


def _loop_to_seconds(loop, speed_factor):
    return round(loop / LOOPS_PER_GAME_SECOND / speed_factor)


def _is_noise(name, blocklist):
    low = name.lower()
    return any(tok in low for tok in blocklist)


def _analyze_tracker(archive, protocol, speed_factor, player_ids):
    """Extract time-series + build orders from the replay tracker stream.

    The tracker stream (VersionedDecoder, build-stable) carries periodic
    per-player score snapshots plus unit/upgrade events. Returns a dict keyed
    by player id. Degrades gracefully to empty analytics when a replay predates
    tracker events or the stream can't be read.
    """
    empty = {'available': False, 'series': {}, 'build_order': {}}
    try:
        raw = archive.read_file('replay.tracker.events')
    except Exception:
        return empty
    if not raw:
        return empty

    series = {pid: [] for pid in player_ids}
    build = {pid: [] for pid in player_ids}
    supply_now = {pid: 0 for pid in player_ids}   # latest food used, for labels
    init_tags = set()                             # unit tags seen starting

    def add_build(pid, loop, name, kind):
        if pid not in build or len(build[pid]) >= _BUILD_ORDER_LIMIT:
            return
        build[pid].append({
            't': _loop_to_seconds(loop, speed_factor),
            'supply': supply_now.get(pid, 0),
            'name': name,
            'kind': kind,
        })

    try:
        events = protocol.decode_replay_tracker_events(raw)
        for ev in events:
            name = ev.get('_event', '')
            loop = ev.get('_gameloop', 0)

            if name.endswith('SPlayerStatsEvent'):
                pid = ev.get('m_playerId')
                if pid not in series:
                    continue
                s = ev.get('m_stats', {}) or {}
                food_used = s.get('m_scoreValueFoodUsed', 0) // _SUPPLY_FIXED_POINT
                supply_now[pid] = food_used
                series[pid].append({
                    't': _loop_to_seconds(loop, speed_factor),
                    'supply_used': food_used,
                    'supply_made': s.get('m_scoreValueFoodMade', 0) // _SUPPLY_FIXED_POINT,
                    'income_min': s.get('m_scoreValueMineralsCollectionRate', 0),
                    'income_gas': s.get('m_scoreValueVespeneCollectionRate', 0),
                    'workers': s.get('m_scoreValueWorkersActiveCount', 0),
                    'army_value': (s.get('m_scoreValueMineralsUsedCurrentArmy', 0)
                                   + s.get('m_scoreValueVespeneUsedCurrentArmy', 0)),
                    'unspent_min': s.get('m_scoreValueMineralsCurrent', 0),
                    'unspent_gas': s.get('m_scoreValueVespeneCurrent', 0),
                })

            elif name.endswith('SUnitInitEvent'):
                pid = ev.get('m_controlPlayerId')
                unit = _text(ev.get('m_unitTypeName'))
                init_tags.add(ev.get('m_unitTagIndex'))
                if not _is_noise(unit, _BUILD_NOISE):
                    add_build(pid, loop, unit, 'structure')

            elif name.endswith('SUnitBornEvent'):
                # Skip the completion of something we already logged at init,
                # and the starting units that exist at loop 0.
                if ev.get('m_unitTagIndex') in init_tags or loop == 0:
                    continue
                pid = ev.get('m_controlPlayerId')
                unit = _text(ev.get('m_unitTypeName'))
                if not _is_noise(unit, _BUILD_NOISE):
                    add_build(pid, loop, unit, 'unit')

            elif name.endswith('SUpgradeEvent'):
                pid = ev.get('m_playerId')
                up = _text(ev.get('m_upgradeTypeName'))
                if ev.get('m_count', 1) > 0 and not _is_noise(up, _UPGRADE_NOISE):
                    add_build(pid, loop, up, 'upgrade')
    except Exception:
        # Partial data is still useful; return whatever decoded cleanly.
        pass

    # Keep only players that actually produced stats, and sort build orders.
    for pid in build:
        build[pid].sort(key=lambda e: e['t'])
    return {
        'available': any(series[pid] for pid in series),
        'series': {str(pid): rows for pid, rows in series.items() if rows},
        'build_order': {str(pid): b for pid, b in build.items() if b},
    }


def summarize(replay_bytes):
    """Decode a replay and return a JSON-serializable summary dict."""
    archive = mpyq.MPQArchive(BytesIO(replay_bytes), listfile=False)

    # Header lives in the MPQ user-data block, decoded by the base protocol.
    header_content = archive.header['user_data_header']['content']
    header = versions.latest().decode_replay_header(header_content)

    version = header['m_version']
    base_build = version['m_baseBuild']
    protocol = versions.build(base_build)

    details = protocol.decode_replay_details(archive.read_file('replay.details'))

    speed_index = _game_speed(archive, protocol, base_build)
    speed_factor = SPEED_FACTORS.get(speed_index, 1.4)

    loops = header.get('m_elapsedGameLoops', 0) or 0
    game_seconds = loops / LOOPS_PER_GAME_SECOND
    real_seconds = game_seconds / speed_factor

    players = []
    for i, p in enumerate(details.get('m_playerList', []) or []):
        toon = p.get('m_toon') or {}
        players.append({
            # Tracker events reference players by a 1-based id; for standard
            # games this matches the player's slot order in the details list.
            'player_id': i + 1,
            'name': _text(p.get('m_name')),
            'race': _normalize_race(p.get('m_race')),
            'result': _result_label(p.get('m_result')),
            'team': p.get('m_teamId'),
            'color': _color_hex(p.get('m_color')),
            # A real battle.net account id marks a human; AI slots report 0.
            'is_human': bool(toon.get('m_id')),
            'region': toon.get('m_region'),
            'handle': '{0}-S2-{1}-{2}'.format(
                toon.get('m_region', 0), toon.get('m_realm', 0),
                toon.get('m_id', 0)) if toon.get('m_id') else None,
        })

    analytics = _analyze_tracker(archive, protocol, speed_factor,
                                 {p['player_id'] for p in players})

    return {
        'analytics': analytics,
        'map_name': _text(details.get('m_title')),
        'players': players,
        'played_at_utc': _filetime_to_iso(
            details.get('m_timeUTC'), details.get('m_timeLocalOffset', 0)),
        'game_version': '{0}.{1}.{2}.{3}'.format(
            version.get('m_major', 0), version.get('m_minor', 0),
            version.get('m_revision', 0), version.get('m_build', 0)),
        'base_build': base_build,
        'game_speed': SPEED_NAMES.get(speed_index, 'Faster'),
        'game_loops': loops,
        'duration_seconds': round(real_seconds),
        'duration_game_seconds': round(game_seconds),
        'is_blizzard_map': bool(details.get('m_isBlizzardMap')),
    }
