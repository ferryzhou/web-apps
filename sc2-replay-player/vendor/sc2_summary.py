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

# Cap on minimap position samples sent to the client (uniformly downsampled
# beyond this). Keeps the payload bounded on long games.
_MINIMAP_MOVE_CAP = 20000

# Units that flood the minimap without being meaningful to watch: creep tumors
# (a bot can lay thousands), larva/eggs, and short-lived spawns. Filtered so the
# map stays readable.
_MINIMAP_NOISE = ('creeptumor', 'larva', 'egg', 'broodling', 'locust',
                  'interceptor', 'cocoon')

# Building type names (base names; matched as a prefix so variants like
# OrbitalCommandFlying, SupplyDepotLowered, SpineCrawlerUprooted are covered).
# Used to draw structures vs. units correctly regardless of whether the unit
# arrived via an init event (buildings) or an init event that is really a
# warp-in/train (e.g. Protoss Stalkers also fire init events).
_BUILDINGS = frozenset([
    # Terran
    'commandcenter', 'orbitalcommand', 'planetaryfortress', 'supplydepot',
    'refinery', 'barracks', 'engineeringbay', 'bunker', 'missileturret',
    'sensortower', 'factory', 'ghostacademy', 'starport', 'armory',
    'fusioncore', 'techlab', 'reactor',
    # Protoss
    'nexus', 'pylon', 'assimilator', 'gateway', 'warpgate', 'forge',
    'cyberneticscore', 'photoncannon', 'shieldbattery', 'roboticsfacility',
    'stargate', 'twilightcouncil', 'templararchive', 'darkshrine',
    'roboticsbay', 'fleetbeacon',
    # Zerg
    'hatchery', 'lair', 'hive', 'extractor', 'spawningpool',
    'evolutionchamber', 'roachwarren', 'banelingnest', 'spinecrawler',
    'sporecrawler', 'hydraliskden', 'lurkerden', 'greaterspire', 'spire',
    'nydusnetwork', 'nyduscanal', 'infestationpit', 'ultraliskcavern',
    'creeptumor',
])


def _loop_to_seconds(loop, speed_factor):
    return round(loop / LOOPS_PER_GAME_SECOND / speed_factor)


def _is_noise(name, blocklist):
    low = name.lower()
    return any(tok in low for tok in blocklist)


def _is_minimap_noise(name):
    # AI rally markers (BeaconArmy, BeaconDefend, ...) aren't real units; the
    # FleetBeacon building does not start with "beacon", so it's unaffected.
    if name.lower().startswith('beacon'):
        return True
    return _is_noise(name, _MINIMAP_NOISE)


def _is_building(name):
    low = name.lower()
    return any(low.startswith(b) for b in _BUILDINGS)


# Rough visual-size tiers for army/worker units so the minimap can draw a ball
# of lings differently from a handful of ultralisks. Matched as a prefix;
# anything unlisted is "medium". (Buildings get a tier too but it's unused.)
_SIZE_SMALL = ('probe', 'scv', 'drone', 'zergling', 'baneling', 'marine',
               'reaper', 'zealot', 'adept', 'widowmine', 'mule', 'changeling')
_SIZE_LARGE = ('siegetank', 'immortal', 'disruptor', 'ravager', 'lurker',
               'warpprism', 'medivac', 'overlord', 'overseer', 'raven',
               'banshee', 'liberator', 'viking', 'hellbat', 'archon', 'infestor')
_SIZE_MASSIVE = ('thor', 'ultralisk', 'colossus', 'broodlord', 'carrier',
                 'battlecruiser', 'tempest', 'mothership', 'leviathan')


def _unit_size(name):
    """Return a size tier 1 (small) .. 4 (massive) for a unit type name."""
    low = name.lower()
    if any(low.startswith(s) for s in _SIZE_MASSIVE):
        return 4
    if any(low.startswith(s) for s in _SIZE_LARGE):
        return 3
    if any(low.startswith(s) for s in _SIZE_SMALL):
        return 1
    return 2


# Building footprint tiers: 1 small (2x2: depots, pylons, turrets, add-ons),
# 3 large (5x5 town halls), 2 medium (3x3 production/tech) for everything else.
_BLD_SMALL = ('supplydepot', 'pylon', 'missileturret', 'sensortower', 'bunker',
              'photoncannon', 'shieldbattery', 'spinecrawler', 'sporecrawler',
              'darkshrine', 'techlab', 'reactor')
_BLD_LARGE = ('commandcenter', 'orbitalcommand', 'planetaryfortress', 'nexus',
              'hatchery', 'lair', 'hive')


def _building_size(name):
    low = name.lower()
    if any(low.startswith(b) for b in _BLD_LARGE):
        return 3
    if any(low.startswith(b) for b in _BLD_SMALL):
        return 1
    return 2


def _marker_size(name):
    """Size tier for the map marker: footprint for buildings, else unit size."""
    return _building_size(name) if _is_building(name) else _unit_size(name)


# Merge state/mode variants of a unit onto one display name so the composition
# readout counts e.g. sieged tanks and tanks together.
_TYPE_MERGE_PREFIXES = ('Viking', 'Liberator', 'WidowMine', 'WarpPrism',
                        'Overlord', 'Overseer', 'Lurker', 'Baneling',
                        'SiegeTank', 'Hellion', 'Ravager', 'Roach', 'Infestor',
                        'Zergling', 'Drone', 'SwarmHost')
_TYPE_SUFFIXES = ('Burrowed', 'Sieged', 'Lowered', 'Flying', 'Uprooted',
                  'Phasing', 'Transport', 'Assault', 'Fighter', 'MP')


def _norm_type(name):
    """Normalize a unit type name to a display name (variants merged)."""
    for pre in _TYPE_MERGE_PREFIXES:
        if name.startswith(pre):
            return pre
    for suf in _TYPE_SUFFIXES:
        if name.endswith(suf) and len(name) > len(suf) + 2:
            name = name[:-len(suf)]
    return name


def _analyze_tracker(archive, protocol, speed_factor, player_ids):
    """Extract analytics + minimap data from the replay tracker stream.

    The tracker stream (VersionedDecoder, build-stable) carries periodic
    per-player score snapshots, unit/upgrade events, and unit positions. Returns
    ``{'analytics': {...}, 'minimap': {...}}``. Degrades gracefully to empty
    payloads when a replay predates tracker events or the stream can't be read.
    """
    empty = {
        'analytics': {'available': False, 'series': {}, 'build_order': {}},
        'minimap': {'available': False},
    }
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

    # Minimap state. A single unit tag-index is reused across the game (tag
    # recycling), so we track discrete instances instead of one record per
    # index: `live` maps an index to the instance currently occupying it, and
    # any previous occupant is closed when a new one is born there. This keeps
    # dead units from lingering forever on the map.
    instances = []             # each: {pid, structure, born_t, died_t, x, y, moves}
    live = {}                  # index -> current open instance

    def add_build(pid, loop, name, kind):
        if pid not in build or len(build[pid]) >= _BUILD_ORDER_LIMIT:
            return
        build[pid].append({
            't': _loop_to_seconds(loop, speed_factor),
            'supply': supply_now.get(pid, 0),
            'name': name,
            'kind': kind,
        })

    def mm_close(index, t):
        inst = live.pop(index, None)
        if inst is not None and inst['died_t'] is None:
            inst['died_t'] = t

    def mm_open(ev, loop, name):
        index = ev.get('m_unitTagIndex')
        t = _loop_to_seconds(loop, speed_factor)
        mm_close(index, t)     # whatever held this index is gone
        inst = {'pid': ev.get('m_controlPlayerId') or 0,
                'structure': 1 if _is_building(name) else 0,
                'size': _marker_size(name), 'type': _norm_type(name),
                'born_t': t, 'died_t': None,
                'x': ev.get('m_x', 0), 'y': ev.get('m_y', 0), 'moves': []}
        live[index] = inst
        instances.append(inst)

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
                # Key by (index, recycle): a tag index is reused across the game,
                # so index alone would mis-flag a recycled unit as a completion.
                init_tags.add((ev.get('m_unitTagIndex'), ev.get('m_unitTagRecycle')))
                if not _is_minimap_noise(unit):
                    mm_open(ev, loop, unit)
                if not _is_noise(unit, _BUILD_NOISE):
                    add_build(pid, loop, unit, 'structure')

            elif name.endswith('SUnitBornEvent'):
                is_completion = (ev.get('m_unitTagIndex'),
                                 ev.get('m_unitTagRecycle')) in init_tags
                unit = _text(ev.get('m_unitTypeName'))
                if not is_completion and not _is_minimap_noise(unit):
                    # A genuinely new unit (not the completion of an init'd one).
                    mm_open(ev, loop, unit)
                # Skip build-order noise: init completions and the loop-0 start.
                if is_completion or loop == 0:
                    continue
                pid = ev.get('m_controlPlayerId')
                if not _is_noise(unit, _BUILD_NOISE):
                    add_build(pid, loop, unit, 'unit')

            elif name.endswith('SUnitTypeChangeEvent'):
                # A unit morphed in place (Roach->Ravager, Overlord->Overseer,
                # Hatchery->Lair, ...): keep the same instance but refresh its
                # size/shape from the new type.
                inst = live.get(ev.get('m_unitTagIndex'))
                if inst is not None:
                    new = _text(ev.get('m_unitTypeName'))
                    inst['structure'] = 1 if _is_building(new) else 0
                    inst['size'] = _marker_size(new)
                    inst['type'] = _norm_type(new)

            elif name.endswith('SUnitDiedEvent'):
                mm_close(ev.get('m_unitTagIndex'),
                         _loop_to_seconds(loop, speed_factor))

            elif name.endswith('SUnitPositionsEvent'):
                t = _loop_to_seconds(loop, speed_factor)
                items = ev.get('m_items', []) or []
                idx = ev.get('m_firstUnitIndex', 0)
                for i in range(0, len(items) - 2, 3):
                    idx += items[i]
                    inst = live.get(idx)
                    if inst is not None:
                        inst['moves'].append((t, items[i + 1], items[i + 2]))

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
    analytics = {
        'available': any(series[pid] for pid in series),
        'series': {str(pid): rows for pid, rows in series.items() if rows},
        'build_order': {str(pid): b for pid, b in build.items() if b},
    }
    return {
        'analytics': analytics,
        'minimap': _build_minimap(instances),
    }


def _build_minimap(instances):
    """Assemble a compact minimap-playback payload from tracked unit instances.

    Each instance carries its birth point plus any position samples, all in one
    coordinate space; the client auto-fits the bounds, so the absolute map scale
    is irrelevant. Birth points are always kept (so stationary units/structures
    appear); the higher-volume position samples are downsampled if very long.
    """
    if not instances:
        return {'available': False}

    births = []      # (t, id, x, y) -- always kept
    positions = []   # (t, id, x, y) -- downsampled if huge
    has_positions = False
    for i, inst in enumerate(instances):
        births.append((inst['born_t'], i, inst['x'], inst['y']))
        for (t, x, y) in inst['moves']:
            positions.append((t, i, x, y))
            has_positions = True

    if len(positions) > _MINIMAP_MOVE_CAP:
        stride = (len(positions) + _MINIMAP_MOVE_CAP - 1) // _MINIMAP_MOVE_CAP
        positions = positions[::stride]

    moves = births + positions
    moves.sort(key=lambda m: m[0])
    min_x = min(m[2] for m in moves); max_x = max(m[2] for m in moves)
    min_y = min(m[3] for m in moves); max_y = max(m[3] for m in moves)

    # Intern type names so each unit only carries a small index.
    type_list = []
    type_index = {}

    def tidx(tp):
        i = type_index.get(tp)
        if i is None:
            i = len(type_list)
            type_index[tp] = i
            type_list.append(tp)
        return i

    # id -> [pid, structure(0/1), born_t, died_t(-1 if survived), size(1-4), typeIdx]
    units = {}
    for i, inst in enumerate(instances):
        units[str(i)] = [inst['pid'], inst['structure'], inst['born_t'],
                         inst['died_t'] if inst['died_t'] is not None else -1,
                         inst['size'], tidx(inst['type'])]

    return {
        'available': True,
        'source': 'positions' if has_positions else 'births',
        'bounds': [min_x, min_y, max_x, max_y],
        'types': type_list,
        'units': units,
        'moves': [[m[0], str(m[1]), m[2], m[3]] for m in moves],
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

    tracker = _analyze_tracker(archive, protocol, speed_factor,
                               {p['player_id'] for p in players})

    return {
        'analytics': tracker['analytics'],
        'minimap': tracker['minimap'],
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
