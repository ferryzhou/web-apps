/*
 * SC2 Ladder Map Terrain Presets (elevation plateaus, chasms, rock pillars & ramps)
 *
 * Coordinates are normalized to [0..1, 0..1] in world space (0,0 = bottom-left,
 * 1,1 = top-right) and mapped into the replay's [minX, minY, maxX, maxY] bounds.
 * The renderer rasterizes these onto a 160x160 elevation heightfield with
 * Chaikin organic cliff smoothing and directional Sobel hillshading.
 *
 * Elevation tiers:
 *   chasms  = unpathable abyss / water / map void borders
 *   level 0 = low ground (base valley)
 *   level 1 = mid-ground expansion shelves / ridges
 *   level 2 = high-ground main bases / commanding overlooks
 *   pillars = unpathable rock walls / line-of-sight blockers
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

  function rDef(from, to, hw, level) {
    const r = ramp(from, to, hw, level);
    r._hw = hw;
    return r;
  }

  // Create a 180-degree rotationally symmetric map from one half
  function sym180(name, cfg) {
    const plateaus = [], ramps = [], chasms = [], pillars = [];
    for (const p of (cfg.plateaus || [])) {
      plateaus.push(p, { level: p.level, poly: m180Poly(p.poly) });
    }
    if (cfg.extraPlateaus) plateaus.push(...cfg.extraPlateaus);

    for (const r of (cfg.ramps || [])) {
      ramps.push(r, ramp(m180Pt(r.from), m180Pt(r.to), r._hw, r.level));
    }
    if (cfg.extraRamps) ramps.push(...cfg.extraRamps);

    for (const c of (cfg.chasms || [])) {
      chasms.push(c, m180Poly(c));
    }
    if (cfg.extraChasms) chasms.push(...cfg.extraChasms);

    for (const k of (cfg.pillars || [])) {
      pillars.push(k, m180Poly(k));
    }
    if (cfg.extraPillars) pillars.push(...cfg.extraPillars);

    return { name, plateaus, ramps, chasms, pillars };
  }

  const PRESETS = {
    alcyone: sym180("Alcyone LE", {
      chasms: [
        [[0.42, 0], [0.64, 0], [0.58, 0.09], [0.46, 0.08]],
        [[0, 0.56], [0.09, 0.57], [0.08, 0.68], [0, 0.70]],
      ],
      plateaus: [
        // Level 1: Natural + 3rd-base pocket shelf with carved choke necks
        { level: 1, poly: [[0, 0], [0.39, 0], [0.41, 0.11], [0.37, 0.21], [0.31, 0.24], [0.25, 0.29], [0.23, 0.37], [0.22, 0.49], [0.14, 0.53], [0, 0.52]] },
        // Level 1: Forward 4th-base ridge
        { level: 1, poly: [[0.33, 0.21], [0.46, 0.19], [0.52, 0.27], [0.50, 0.36], [0.43, 0.39], [0.34, 0.34]] },
        // Level 1: Corner gold expansion island
        { level: 1, poly: [[0, 0.71], [0.15, 0.71], [0.21, 0.77], [0.22, 0.87], [0.17, 1], [0, 1]] },
        // Level 1: Xel'Naga watchtower overlook pod
        { level: 1, poly: [[0.29, 0.57], [0.38, 0.55], [0.43, 0.62], [0.39, 0.69], [0.31, 0.68], [0.27, 0.62]] },
        // Level 2: High-ground main with mineral pocket & narrow ramp neck
        { level: 2, poly: [[0, 0], [0.21, 0], [0.23, 0.09], [0.21, 0.18], [0.22, 0.26], [0.16, 0.31], [0.07, 0.32], [0, 0.29]] },
      ],
      pillars: [
        [[0.46, 0.44], [0.50, 0.43], [0.51, 0.47], [0.47, 0.48]],
        [[0.25, 0.51], [0.29, 0.50], [0.30, 0.54], [0.26, 0.55]],
      ],
      ramps: [
        rDef([0.245, 0.125], [0.182, 0.135], 0.024, 2),
        rDef([0.355, 0.275], [0.295, 0.205], 0.032, 1),
        rDef([0.255, 0.410], [0.185, 0.410], 0.027, 1),
        rDef([0.470, 0.405], [0.425, 0.330], 0.028, 1),
        rDef([0.425, 0.545], [0.375, 0.600], 0.022, 1),
        rDef([0.240, 0.785], [0.170, 0.805], 0.026, 1),
      ],
    }),

    sitedelta: sym180("Site Delta LE", {
      chasms: [
        [[0.44, 1], [0.62, 1], [0.58, 0.91], [0.46, 0.92]],
      ],
      plateaus: [
        { level: 1, poly: [[0, 1], [0.39, 1], [0.42, 0.88], [0.39, 0.77], [0.30, 0.69], [0.24, 0.58], [0.22, 0.46], [0.11, 0.44], [0, 0.46]] },
        { level: 1, poly: [[0.42, 0.81], [0.56, 0.84], [0.63, 0.76], [0.60, 0.66], [0.48, 0.63], [0.42, 0.70]] },
        { level: 1, poly: [[0.27, 0.43], [0.38, 0.49], [0.45, 0.42], [0.41, 0.34], [0.30, 0.33]] },
        { level: 2, poly: [[0, 1], [0.22, 1], [0.25, 0.90], [0.23, 0.80], [0.16, 0.72], [0.06, 0.71], [0, 0.73]] },
      ],
      pillars: [
        [[0.46, 0.53], [0.51, 0.54], [0.52, 0.50], [0.47, 0.49]],
      ],
      ramps: [
        rDef([0.265, 0.830], [0.195, 0.865], 0.025, 2),
        rDef([0.390, 0.715], [0.320, 0.765], 0.032, 1),
        rDef([0.265, 0.540], [0.180, 0.550], 0.027, 1),
        rDef([0.525, 0.610], [0.505, 0.700], 0.027, 1),
        rDef([0.450, 0.440], [0.380, 0.420], 0.023, 1),
      ],
    }),

    oceanborn: sym180("Oceanborn LE", {
      chasms: [
        [[0.28, 0.28], [0.42, 0.22], [0.48, 0.32], [0.36, 0.39]],
        [[0, 0.34], [0.10, 0.35], [0.09, 0.45], [0, 0.46]],
      ],
      plateaus: [
        { level: 1, poly: [[0, 1], [0.43, 1], [0.45, 0.86], [0.43, 0.75], [0.32, 0.68], [0.22, 0.58], [0.17, 0.50], [0, 0.49]] },
        { level: 1, poly: [[0, 0.25], [0.18, 0.27], [0.25, 0.19], [0.25, 0.08], [0.19, 0], [0, 0]] },
        { level: 1, poly: [[0.37, 0.58], [0.46, 0.61], [0.51, 0.54], [0.47, 0.47], [0.39, 0.48]] },
        { level: 2, poly: [[0, 1], [0.21, 1], [0.24, 0.89], [0.22, 0.79], [0.15, 0.70], [0, 0.70]] },
      ],
      ramps: [
        rDef([0.265, 0.840], [0.190, 0.865], 0.024, 2),
        rDef([0.430, 0.715], [0.360, 0.785], 0.032, 1),
        rDef([0.225, 0.515], [0.150, 0.585], 0.027, 1),
        rDef([0.270, 0.225], [0.185, 0.180], 0.025, 1),
        rDef([0.465, 0.475], [0.430, 0.545], 0.023, 1),
      ],
    }),

    postyouth: sym180("Post-Youth LE", {
      chasms: [
        [[0.40, 0], [0.58, 0], [0.54, 0.08], [0.42, 0.07]],
      ],
      plateaus: [
        { level: 1, poly: [[0, 0], [0.36, 0], [0.39, 0.12], [0.37, 0.23], [0.26, 0.32], [0.21, 0.48], [0.11, 0.49], [0, 0.47]] },
        { level: 1, poly: [[0.33, 0.30], [0.44, 0.33], [0.46, 0.42], [0.40, 0.47], [0.31, 0.42]] },
        { level: 1, poly: [[0, 0.73], [0.16, 0.73], [0.22, 0.80], [0.21, 0.90], [0.15, 1], [0, 1]] },
        { level: 2, poly: [[0, 0], [0.20, 0], [0.22, 0.11], [0.20, 0.20], [0.14, 0.27], [0, 0.26]] },
      ],
      pillars: [
        [[0.46, 0.53], [0.50, 0.52], [0.50, 0.56], [0.46, 0.57]],
      ],
      ramps: [
        rDef([0.245, 0.135], [0.175, 0.145], 0.024, 2),
        rDef([0.370, 0.245], [0.305, 0.180], 0.030, 1),
        rDef([0.245, 0.380], [0.170, 0.385], 0.026, 1),
        rDef([0.465, 0.445], [0.400, 0.400], 0.022, 1),
        rDef([0.235, 0.795], [0.165, 0.820], 0.025, 1),
      ],
    }),

    crimsoncourt: sym180("Crimson Court LE", {
      chasms: [
        [[0, 0.55], [0.09, 0.57], [0.09, 0.72], [0, 0.74]],
      ],
      plateaus: [
        { level: 1, poly: [[0, 0], [0.41, 0], [0.43, 0.14], [0.41, 0.25], [0.29, 0.32], [0.23, 0.49], [0.13, 0.51], [0, 0.49]] },
        { level: 1, poly: [[0.44, 0.15], [0.58, 0.16], [0.63, 0.24], [0.59, 0.33], [0.46, 0.31]] },
        { level: 2, poly: [[0, 0], [0.22, 0], [0.25, 0.11], [0.23, 0.21], [0.16, 0.29], [0, 0.28]] },
      ],
      pillars: [
        [[0.44, 0.46], [0.49, 0.45], [0.50, 0.49], [0.45, 0.50]],
      ],
      ramps: [
        rDef([0.275, 0.120], [0.200, 0.125], 0.022, 2),
        rDef([0.120, 0.315], [0.120, 0.240], 0.020, 2),
        rDef([0.405, 0.265], [0.330, 0.200], 0.032, 1),
        rDef([0.265, 0.420], [0.190, 0.420], 0.026, 1),
        rDef([0.525, 0.345], [0.525, 0.260], 0.027, 1),
      ],
    }),

    ghostriver: sym180("Ghost River LE", {
      chasms: [
        [[0.36, 0.36], [0.44, 0.44], [0.40, 0.49], [0.32, 0.41]],
      ],
      plateaus: [
        { level: 1, poly: [[0, 1], [0.47, 1], [0.46, 0.87], [0.43, 0.77], [0.33, 0.67], [0.24, 0.56], [0.20, 0.38], [0.09, 0.35], [0, 0.37]] },
        { level: 1, poly: [[0.46, 0.85], [0.62, 0.87], [0.67, 0.79], [0.63, 0.71], [0.48, 0.69]] },
        { level: 2, poly: [[0, 1], [0.22, 1], [0.24, 0.89], [0.22, 0.79], [0.14, 0.72], [0, 0.72]] },
      ],
      ramps: [
        rDef([0.265, 0.840], [0.190, 0.865], 0.024, 2),
        rDef([0.425, 0.695], [0.355, 0.765], 0.032, 1),
        rDef([0.285, 0.555], [0.220, 0.620], 0.028, 1),
        rDef([0.580, 0.675], [0.560, 0.760], 0.027, 1),
      ],
    }),

    goldenaura: sym180("Goldenaura LE", {
      chasms: [
        [[0.74, 0], [0.90, 0], [0.88, 0.08], [0.76, 0.09]],
      ],
      plateaus: [
        { level: 1, poly: [[0, 0], [0.39, 0], [0.41, 0.12], [0.39, 0.23], [0.27, 0.30], [0.22, 0.51], [0.12, 0.53], [0, 0.51]] },
        { level: 1, poly: [[0.51, 0.13], [0.66, 0.15], [0.71, 0.23], [0.67, 0.31], [0.53, 0.29]] },
        { level: 1, poly: [[0.27, 0.61], [0.37, 0.59], [0.41, 0.67], [0.36, 0.73], [0.28, 0.71]] },
        { level: 2, poly: [[0, 0], [0.21, 0], [0.23, 0.11], [0.21, 0.22], [0.14, 0.29], [0, 0.29]] },
      ],
      pillars: [
        [[0.46, 0.45], [0.51, 0.44], [0.51, 0.48], [0.46, 0.49]],
      ],
      ramps: [
        rDef([0.255, 0.130], [0.180, 0.140], 0.024, 2),
        rDef([0.385, 0.255], [0.320, 0.190], 0.030, 1),
        rDef([0.265, 0.440], [0.190, 0.440], 0.026, 1),
        rDef([0.605, 0.325], [0.600, 0.240], 0.027, 1),
        rDef([0.415, 0.620], [0.350, 0.655], 0.021, 1),
      ],
    }),

    equilibrium: sym180("Equilibrium LE", {
      chasms: [
        [[0, 0.26], [0.08, 0.28], [0.08, 0.40], [0, 0.41]],
      ],
      plateaus: [
        { level: 1, poly: [[0, 1], [0.41, 1], [0.42, 0.87], [0.39, 0.76], [0.27, 0.68], [0.22, 0.47], [0.12, 0.45], [0, 0.46]] },
        { level: 1, poly: [[0.42, 0.79], [0.56, 0.81], [0.60, 0.72], [0.57, 0.65], [0.44, 0.64]] },
        { level: 1, poly: [[0.31, 0.44], [0.41, 0.47], [0.45, 0.39], [0.41, 0.33], [0.32, 0.34]] },
        { level: 2, poly: [[0, 1], [0.21, 1], [0.23, 0.89], [0.21, 0.79], [0.15, 0.72], [0, 0.72]] },
      ],
      pillars: [
        [[0.47, 0.52], [0.52, 0.51], [0.52, 0.55], [0.47, 0.56]],
      ],
      ramps: [
        rDef([0.255, 0.850], [0.180, 0.865], 0.024, 2),
        rDef([0.385, 0.715], [0.320, 0.770], 0.030, 1),
        rDef([0.265, 0.560], [0.190, 0.560], 0.026, 1),
        rDef([0.505, 0.615], [0.500, 0.695], 0.026, 1),
        rDef([0.455, 0.410], [0.390, 0.400], 0.021, 1),
      ],
    }),

    amphion: sym180("Amphion LE", {
      plateaus: [
        { level: 1, poly: [[0, 0], [0.40, 0], [0.42, 0.12], [0.40, 0.23], [0.28, 0.32], [0.22, 0.51], [0.12, 0.53], [0, 0.51]] },
        { level: 1, poly: [[0.43, 0.21], [0.57, 0.23], [0.61, 0.31], [0.57, 0.39], [0.44, 0.36]] },
        { level: 2, poly: [[0, 0], [0.21, 0], [0.24, 0.11], [0.22, 0.22], [0.15, 0.30], [0, 0.30]] },
      ],
      pillars: [
        [[0.46, 0.46], [0.51, 0.45], [0.51, 0.50], [0.46, 0.50]],
      ],
      ramps: [
        rDef([0.265, 0.140], [0.190, 0.145], 0.024, 2),
        rDef([0.395, 0.255], [0.330, 0.190], 0.030, 1),
        rDef([0.265, 0.440], [0.190, 0.440], 0.026, 1),
        rDef([0.525, 0.405], [0.520, 0.320], 0.026, 1),
      ],
    }),

    dynasty: sym180("Dynasty LE", {
      chasms: [
        [[0.42, 1], [0.60, 1], [0.56, 0.91], [0.44, 0.92]],
      ],
      plateaus: [
        { level: 1, poly: [[0, 1], [0.37, 1], [0.39, 0.87], [0.37, 0.76], [0.25, 0.68], [0.20, 0.48], [0.10, 0.46], [0, 0.48]] },
        { level: 2, poly: [[0, 1], [0.20, 1], [0.23, 0.89], [0.21, 0.80], [0.14, 0.72], [0, 0.72]] },
      ],
      extraPlateaus: [
        { level: 1, poly: [[0.39, 0.42], [0.52, 0.38], [0.61, 0.46], [0.61, 0.58], [0.48, 0.62], [0.39, 0.54]] },
        { level: 2, poly: [[0.44, 0.46], [0.54, 0.44], [0.56, 0.54], [0.46, 0.56]] },
      ],
      ramps: [
        rDef([0.255, 0.860], [0.180, 0.870], 0.024, 2),
        rDef([0.365, 0.715], [0.300, 0.780], 0.028, 1),
        rDef([0.245, 0.560], [0.170, 0.560], 0.026, 1),
        rDef([0.395, 0.585], [0.460, 0.540], 0.024, 1),
      ],
    }),

    gresvan: sym180("Gresvan LE", {
      chasms: [
        [[0, 0.58], [0.08, 0.60], [0.08, 0.74], [0, 0.76]],
      ],
      plateaus: [
        { level: 1, poly: [[0, 0], [0.41, 0], [0.43, 0.13], [0.41, 0.25], [0.29, 0.34], [0.22, 0.53], [0.12, 0.55], [0, 0.53]] },
        { level: 1, poly: [[0.45, 0.15], [0.61, 0.17], [0.65, 0.26], [0.61, 0.35], [0.46, 0.32]] },
        { level: 1, poly: [[0.29, 0.55], [0.39, 0.53], [0.43, 0.61], [0.38, 0.67], [0.30, 0.65]] },
        { level: 2, poly: [[0, 0], [0.21, 0], [0.24, 0.12], [0.22, 0.22], [0.15, 0.30], [0, 0.30]] },
      ],
      ramps: [
        rDef([0.265, 0.130], [0.190, 0.145], 0.024, 2),
        rDef([0.405, 0.265], [0.340, 0.200], 0.030, 1),
        rDef([0.265, 0.440], [0.190, 0.440], 0.026, 1),
        rDef([0.545, 0.365], [0.540, 0.280], 0.026, 1),
        rDef([0.435, 0.560], [0.370, 0.595], 0.021, 1),
      ],
    }),

    kingsejongstation: sym180("King Sejong Station LE", {
      chasms: [
        [[0.44, 0], [0.62, 0], [0.58, 0.08], [0.46, 0.08]],
      ],
      plateaus: [
        { level: 1, poly: [[0, 0], [0.39, 0], [0.41, 0.12], [0.39, 0.23], [0.27, 0.32], [0.22, 0.51], [0.12, 0.53], [0, 0.51]] },
        { level: 1, poly: [[0.33, 0.55], [0.45, 0.57], [0.49, 0.65], [0.44, 0.70], [0.34, 0.68]] },
        { level: 1, poly: [[0, 0.73], [0.16, 0.73], [0.22, 0.81], [0.21, 0.91], [0.15, 1], [0, 1]] },
        { level: 2, poly: [[0, 0], [0.21, 0], [0.23, 0.11], [0.21, 0.21], [0.15, 0.28], [0, 0.28]] },
      ],
      pillars: [
        [[0.46, 0.46], [0.51, 0.45], [0.51, 0.49], [0.46, 0.50]],
      ],
      ramps: [
        rDef([0.255, 0.130], [0.180, 0.145], 0.024, 2),
        rDef([0.385, 0.255], [0.320, 0.190], 0.030, 1),
        rDef([0.265, 0.420], [0.190, 0.420], 0.026, 1),
        rDef([0.485, 0.600], [0.420, 0.625], 0.022, 1),
        rDef([0.245, 0.800], [0.170, 0.820], 0.025, 1),
      ],
    }),
  };

  function normalizeMapKey(name) {
    return String(name || "")
      .toLowerCase()
      .replace(/\(.*?\)/g, "")
      .replace(/\b(le|aie|void|ladder|edition|te)\b/g, "")
      .replace(/[^a-z0-9]/g, "");
  }

  // Resolve a map name to world-space terrain { name, plateaus, ramps, chasms, pillars }.
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
      chasms: (preset.chasms || []).map((c) => c.map(toWorld)),
      pillars: (preset.pillars || []).map((k) => k.map(toWorld)),
    };
  }

  window.SC2_MAP_TERRAINS = PRESETS;
  window.lookupMapTerrain = lookupMapTerrain;
})();
