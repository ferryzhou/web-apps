"""
Protocol version loader for the vendored s2protocol subset.

This is a slimmed-down, Python 3.12-safe replacement for the upstream
s2protocol ``versions/__init__.py`` (which relies on the removed ``imp``
module). It discovers the ``protocolNNNNN.py`` files bundled alongside it and
imports them via ``importlib``.

Only a handful of recent protocol versions are vendored. ``build()`` falls back
to ``latest()`` when an exact match is not available -- this is safe for the
VersionedDecoder-based streams (replay header, details, initdata, tracker
events, attributes) which are stable across builds. Strictly build-specific
streams (game/message events) are not decoded by this app yet.
"""

import importlib
import os
import re

_PATTERN = re.compile(r'protocol([0-9]+)\.py$')


def list_all(base_path=None):
    """Return the vendored protocol file names, sorted by build number."""
    if base_path is None:
        base_path = os.path.dirname(__file__)
    files = [f for f in os.listdir(base_path) if _PATTERN.match(f)]
    files.sort(key=lambda f: int(_PATTERN.match(f).group(1)))
    return files


def _import(module_name):
    return importlib.import_module('s2protocol.versions.' + module_name)


def latest():
    """Import the newest vendored protocol module."""
    files = list_all()
    if not files:
        raise ImportError('No vendored protocol versions found')
    return _import(files[-1].split('.')[0])


def build(build_version):
    """Import the module for a specific build, falling back to ``latest()``."""
    try:
        return _import('protocol{0:05d}'.format(build_version))
    except ImportError:
        return latest()
