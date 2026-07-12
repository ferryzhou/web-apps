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
    for p in details.get('m_playerList', []) or []:
        toon = p.get('m_toon') or {}
        players.append({
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

    return {
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
