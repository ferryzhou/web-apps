/*
 * SC2 Ladder Map Terrain Presets (elevation plateaus & ramps)
 *
 * Coordinates are normalized to [0..1, 0..1] in world space (0,0 = bottom-left,
 * 1,1 = top-right) and mapped into the replay's [minX, minY, maxX, maxY] bounds
 * at render time. Elevation tiers:
 *   level 0 = low ground (base valley)
 *   level 1 = mid-ground expansion shelves / ridges
 *   level 2 = high-ground main bases / commanding overlooks
 */
(() => {
  "use strict";

  const m180Pt = ([x, y]) => [1 - x, 1 - y];
  const m180Poly = (poly) => poly.map(m180Pt);

  // Build a ramp quad in normalized [0..1] coords from low -> high
  function ramp(from, to, hw, level) {
    const dx = to[0] - from[0], dy = to[1] - from[1];
    const len = Math.hypot(dx, dy) || 1;
    const px = -dy / len, py = dx / len;
    return {
      level, from, to,
      poly: [
        [from[0] + px * hw, from[1] + py * hw],
        [from[0] - px * hw, from[1] - py * hw],
        [to[0] - px * hw, to[1] - py * hw],
        [to[0] + px * hw, to[1] + py * hw],
      ],
    };
  }

  // Helper: create a 180-degree rotationally symmetric map from one half
  function sym180(name, halfPlateaus, halfRamps, extraPlateaus, extraRamps) {
    const plateaus = [];
    for (const p of halfPlateaus) {
      plateaus.push(p, { level: p.level, poly: m180Poly(p.poly) });
    }
    if (extraPlateaus) plateaus.push(...extraPlateaus);

    const ramps = [];
    for (const r of halfRamps) {
      ramps.push(r, ramp(m180Pt(r.from), m180Pt(r.to), r._hw, r.level));
    }
    if (extraRamps) ramps.push(...extraRamps);
    return { name, plateaus, ramps };
  }

  function rDef(from, to, hw, level) {
    const r = ramp(from, to, hw, level);
    r._hw = hw;
    return r;
  }

  const PRESETS = {
    alcyone: sym180(
      "Alcyone LE",
      [
        // Level 1: Nat + 3rd shelf, 4th shelf, gold corner, watchtower pod
        { level: 1, poly: [[0, 0], [0.37, 0], [0.37, 0.20], [0.30, 0.24], [0.22, 0.30], [0.21, 0.49], [0.15, 0.52], [0, 0.52]] },
        { level: 1, poly: [[0.33, 0.20], [0.48, 0.20], [0.51, 0.31], [0.46, 0.37], [0.35, 0.35]] },
        { level: 1, poly: [[0, 0.72], [0.19, 0.72], [0.21, 0.82], [0.17, 1], [0, 1]] },
        { level: 1, poly: [[0.30, 0.58], [0.40, 0.56], [0.42, 0.66], [0.33, 0.69], [0.28, 0.63]] },
        // Level 2: High-ground main
        { level: 2, poly: [[0, 0], [0.20, 0], [0.22, 0.08], [0.20, 0.25], [0.15, 0.30], [0, 0.30]] },
      ],
      [
        rDef([0.235, 0.127], [0.179, 0.134], 0.024, 2),
        rDef([0.34, 0.27], [0.29, 0.21], 0.030, 1),
        rDef([0.247, 0.408], [0.185, 0.408], 0.026, 1),
        rDef([0.463, 0.394], [0.426, 0.331], 0.028, 1),
        rDef([0.420, 0.549], [0.377, 0.599], 0.020, 1),
        rDef([0.235, 0.789], [0.173, 0.803], 0.025, 1),
      ]
    ),

    sitedelta: sym180(
      "Site Delta LE",
      [
        // TL <-> BR diagonal
        { level: 1, poly: [[0, 1], [0.38, 1], [0.40, 0.78], [0.28, 0.66], [0.22, 0.48], [0, 0.46]] },
        { level: 1, poly: [[0.42, 0.80], [0.60, 0.82], [0.62, 0.68], [0.48, 0.64]] },
        { level: 1, poly: [[0.28, 0.44], [0.40, 0.48], [0.44, 0.38], [0.32, 0.34]] },
        { level: 2, poly: [[0, 1], [0.22, 1], [0.24, 0.82], [0.16, 0.72], [0, 0.72]] },
      ],
      [
        rDef([0.26, 0.83], [0.20, 0.86], 0.025, 2),
        rDef([0.38, 0.72], [0.32, 0.76], 0.030, 1),
        rDef([0.26, 0.54], [0.18, 0.55], 0.026, 1),
        rDef([0.52, 0.62], [0.50, 0.70], 0.026, 1),
        rDef([0.44, 0.44], [0.38, 0.42], 0.022, 1),
      ]
    ),

    oceanborn: sym180(
      "Oceanborn LE",
      [
        // TL <-> BR with wide central low-ground water basin & twin bridges
        { level: 1, poly: [[0, 1], [0.42, 1], [0.44, 0.76], [0.32, 0.68], [0.18, 0.52], [0, 0.50]] },
        { level: 1, poly: [[0, 0.24], [0.22, 0.26], [0.26, 0.12], [0.20, 0], [0, 0]] },
        { level: 1, poly: [[0.38, 0.58], [0.48, 0.60], [0.50, 0.50], [0.40, 0.48]] },
        { level: 2, poly: [[0, 1], [0.21, 1], [0.23, 0.80], [0.15, 0.70], [0, 0.70]] },
      ],
      [
        rDef([0.26, 0.84], [0.19, 0.86], 0.024, 2),
        rDef([0.42, 0.72], [0.36, 0.78], 0.030, 1),
        rDef([0.22, 0.52], [0.15, 0.58], 0.026, 1),
        rDef([0.26, 0.22], [0.18, 0.18], 0.024, 1),
        rDef([0.46, 0.48], [0.43, 0.54], 0.022, 1),
      ]
    ),

    postyouth: sym180(
      "Post-Youth LE",
      [
        // BL <-> TR compact macro with forward gold natural & twin center overlooks
        { level: 1, poly: [[0, 0], [0.35, 0], [0.38, 0.22], [0.24, 0.34], [0.20, 0.48], [0, 0.48]] },
        { level: 1, poly: [[0.34, 0.30], [0.46, 0.34], [0.44, 0.46], [0.32, 0.42]] },
        { level: 1, poly: [[0, 0.74], [0.20, 0.74], [0.22, 0.86], [0.16, 1], [0, 1]] },
        { level: 2, poly: [[0, 0], [0.19, 0], [0.21, 0.18], [0.14, 0.26], [0, 0.26]] },
      ],
      [
        rDef([0.24, 0.14], [0.17, 0.14], 0.024, 2),
        rDef([0.36, 0.24], [0.30, 0.18], 0.030, 1),
        rDef([0.24, 0.38], [0.17, 0.38], 0.026, 1),
        rDef([0.46, 0.44], [0.40, 0.40], 0.022, 1),
        rDef([0.23, 0.80], [0.17, 0.82], 0.024, 1),
      ]
    ),

    crimsoncourt: sym180(
      "Crimson Court LE",
      [
        // BL <-> TR with double-ramp main & central courtyard
        { level: 1, poly: [[0, 0], [0.40, 0], [0.42, 0.24], [0.28, 0.32], [0.22, 0.50], [0, 0.50]] },
        { level: 1, poly: [[0.44, 0.16], [0.62, 0.18], [0.60, 0.32], [0.46, 0.30]] },
        { level: 2, poly: [[0, 0], [0.22, 0], [0.24, 0.20], [0.16, 0.28], [0, 0.28]] },
      ],
      [
        rDef([0.27, 0.12], [0.20, 0.12], 0.022, 2),
        rDef([0.12, 0.31], [0.12, 0.24], 0.020, 2), // backdoor ramp
        rDef([0.40, 0.26], [0.33, 0.20], 0.032, 1),
        rDef([0.26, 0.42], [0.19, 0.42], 0.026, 1),
        rDef([0.52, 0.34], [0.52, 0.26], 0.026, 1),
      ]
    ),

    ghostriver: sym180(
      "Ghost River LE",
      [
        // TL <-> BR separated by a diagonal SW->NE low-ground river valley
        { level: 1, poly: [[0, 1], [0.46, 1], [0.44, 0.78], [0.26, 0.60], [0.20, 0.38], [0, 0.36]] },
        { level: 1, poly: [[0.46, 0.84], [0.66, 0.86], [0.64, 0.72], [0.48, 0.70]] },
        { level: 2, poly: [[0, 1], [0.21, 1], [0.23, 0.80], [0.14, 0.72], [0, 0.72]] },
      ],
      [
        rDef([0.26, 0.84], [0.19, 0.86], 0.024, 2),
        rDef([0.42, 0.70], [0.35, 0.76], 0.030, 1),
        rDef([0.28, 0.56], [0.22, 0.62], 0.028, 1),
        rDef([0.58, 0.68], [0.56, 0.76], 0.026, 1),
      ]
    ),

    goldenaura: sym180(
      "Goldenaura LE",
      [
        // BL <-> TR with wide central arena & flanking gold ridges
        { level: 1, poly: [[0, 0], [0.38, 0], [0.40, 0.22], [0.26, 0.30], [0.22, 0.52], [0, 0.52]] },
        { level: 1, poly: [[0.52, 0.14], [0.70, 0.16], [0.68, 0.30], [0.54, 0.28]] },
        { level: 1, poly: [[0.28, 0.62], [0.38, 0.60], [0.40, 0.70], [0.30, 0.72]] },
        { level: 2, poly: [[0, 0], [0.20, 0], [0.22, 0.22], [0.14, 0.29], [0, 0.29]] },
      ],
      [
        rDef([0.25, 0.13], [0.18, 0.14], 0.024, 2),
        rDef([0.38, 0.25], [0.32, 0.19], 0.030, 1),
        rDef([0.26, 0.44], [0.19, 0.44], 0.026, 1),
        rDef([0.60, 0.32], [0.60, 0.24], 0.026, 1),
        rDef([0.41, 0.62], [0.35, 0.65], 0.020, 1),
      ]
    ),

    equilibrium: sym180(
      "Equilibrium LE",
      [
        // TL <-> BR classic symmetric macro map
        { level: 1, poly: [[0, 1], [0.40, 1], [0.40, 0.76], [0.26, 0.68], [0.22, 0.46], [0, 0.46]] },
        { level: 1, poly: [[0.42, 0.78], [0.58, 0.80], [0.58, 0.66], [0.44, 0.64]] },
        { level: 1, poly: [[0.32, 0.44], [0.42, 0.46], [0.44, 0.36], [0.34, 0.34]] },
        { level: 2, poly: [[0, 1], [0.20, 1], [0.22, 0.80], [0.15, 0.72], [0, 0.72]] },
      ],
      [
        rDef([0.25, 0.85], [0.18, 0.86], 0.024, 2),
        rDef([0.38, 0.72], [0.32, 0.77], 0.030, 1),
        rDef([0.26, 0.56], [0.19, 0.56], 0.026, 1),
        rDef([0.50, 0.62], [0.50, 0.69], 0.026, 1),
        rDef([0.45, 0.41], [0.39, 0.40], 0.020, 1),
      ]
    ),

    amphion: sym180(
      "Amphion LE",
      [
        { level: 1, poly: [[0, 0], [0.39, 0], [0.41, 0.22], [0.27, 0.32], [0.22, 0.52], [0, 0.52]] },
        { level: 1, poly: [[0.44, 0.22], [0.60, 0.24], [0.58, 0.38], [0.44, 0.36]] },
        { level: 2, poly: [[0, 0], [0.21, 0], [0.23, 0.22], [0.15, 0.30], [0, 0.30]] },
      ],
      [
        rDef([0.26, 0.14], [0.19, 0.14], 0.024, 2),
        rDef([0.39, 0.25], [0.33, 0.19], 0.030, 1),
        rDef([0.26, 0.44], [0.19, 0.44], 0.026, 1),
        rDef([0.52, 0.40], [0.52, 0.32], 0.026, 1),
      ]
    ),

    dynasty: sym180(
      "Dynasty LE",
      [
        // TL <-> BR with central high-ground fortress ridge
        { level: 1, poly: [[0, 1], [0.36, 1], [0.38, 0.76], [0.24, 0.68], [0.20, 0.48], [0, 0.48]] },
        { level: 2, poly: [[0, 1], [0.20, 1], [0.22, 0.80], [0.14, 0.72], [0, 0.72]] },
      ],
      [
        rDef([0.25, 0.86], [0.18, 0.87], 0.024, 2),
        rDef([0.36, 0.72], [0.30, 0.78], 0.028, 1),
        rDef([0.24, 0.56], [0.17, 0.56], 0.026, 1),
        // Ramps onto central fortress ridge
        rDef([0.40, 0.58], [0.46, 0.54], 0.024, 1),
      ],
      // Shared central ridge (level 1 base + level 2 crown)
      [
        { level: 1, poly: [[0.40, 0.42], [0.58, 0.40], [0.60, 0.58], [0.42, 0.60]] },
        { level: 2, poly: [[0.45, 0.46], [0.55, 0.45], [0.55, 0.54], [0.45, 0.55]] },
      ]
    ),

    gresvan: sym180(
      "Gresvan LE",
      [
        { level: 1, poly: [[0, 0], [0.40, 0], [0.42, 0.24], [0.28, 0.34], [0.22, 0.54], [0, 0.54]] },
        { level: 1, poly: [[0.46, 0.16], [0.64, 0.18], [0.62, 0.34], [0.46, 0.32]] },
        { level: 1, poly: [[0.30, 0.56], [0.40, 0.54], [0.42, 0.64], [0.32, 0.66]] },
        { level: 2, poly: [[0, 0], [0.21, 0], [0.23, 0.22], [0.15, 0.30], [0, 0.30]] },
      ],
      [
        rDef([0.26, 0.13], [0.19, 0.14], 0.024, 2),
        rDef([0.40, 0.26], [0.34, 0.20], 0.030, 1),
        rDef([0.26, 0.44], [0.19, 0.44], 0.026, 1),
        rDef([0.54, 0.36], [0.54, 0.28], 0.026, 1),
        rDef([0.43, 0.56], [0.37, 0.59], 0.020, 1),
      ]
    ),

    kingsejongstation: sym180(
      "King Sejong Station LE",
      [
        // Classic BL <-> TR layout with central watchtower overlooks
        { level: 1, poly: [[0, 0], [0.38, 0], [0.40, 0.22], [0.26, 0.32], [0.22, 0.52], [0, 0.52]] },
        { level: 1, poly: [[0.34, 0.56], [0.46, 0.58], [0.48, 0.68], [0.36, 0.68]] },
        { level: 1, poly: [[0, 0.74], [0.20, 0.74], [0.22, 0.88], [0.16, 1], [0, 1]] },
        { level: 2, poly: [[0, 0], [0.20, 0], [0.22, 0.20], [0.15, 0.28], [0, 0.28]] },
      ],
      [
        rDef([0.25, 0.13], [0.18, 0.14], 0.024, 2),
        rDef([0.38, 0.25], [0.32, 0.19], 0.030, 1),
        rDef([0.26, 0.42], [0.19, 0.42], 0.026, 1),
        rDef([0.48, 0.60], [0.42, 0.62], 0.022, 1),
        rDef([0.24, 0.80], [0.17, 0.82], 0.024, 1),
      ]
    ),
  };

  function normalizeMapKey(name) {
    return String(name || "")
      .toLowerCase()
      .replace(/\(.*?\)/g, "")
      .replace(/\b(le|aie|void|ladder|edition|te)\b/g, "")
      .replace(/[^a-z0-9]/g, "");
  }

  // Resolve a map name to world-space terrain { name, plateaus, ramps } for the given bounds.
  function lookupMapTerrain(mapName, bounds) {
    const key = normalizeMapKey(mapName);
    if (!key) return null;
    let preset = PRESETS[key];
    if (!preset) {
      for (const k of Object.keys(PRESETS)) {
        if (key.includes(k) || k.includes(key)) { preset = PRESETS[k]; break; }
      }
    }
    if (!preset) return null;

    const [minX, minY, maxX, maxY] = bounds;
    const w = Math.max(1, maxX - minX), h = Math.max(1, maxY - minY);
    const toWorld = ([nx, ny]) => [minX + nx * w, minY + ny * h];

    return {
      name: preset.name,
      plateaus: preset.plateaus.map((p) => ({ level: p.level, poly: p.poly.map(toWorld) })),
      ramps: preset.ramps.map((r) => ({
        level: r.level,
        from: toWorld(r.from),
        to: toWorld(r.to),
        poly: r.poly.map(toWorld),
      })),
    };
  }

  window.SC2_MAP_TERRAINS = PRESETS;
  window.lookupMapTerrain = lookupMapTerrain;
})();
