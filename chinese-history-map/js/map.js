// 地图层：用 Leaflet 按年渲染疆域多边形、都城与事件标记。
import * as data from "./data.js";
import { esc } from "./util.js";

export function initMap(elId, { onSelect } = {}) {
  const map = L.map(elId, { zoomControl: true, attributionControl: true })
    .setView([35.5, 112], 5);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 10,
    }
  ).addTo(map);

  const territoryLayer = L.layerGroup().addTo(map);
  const markerLayer = L.layerGroup().addTo(map);

  let renderToken = 0; // 防止快速拖动时的竞态

  async function render(year) {
    const token = ++renderToken;
    territoryLayer.clearLayers();
    markerLayer.clearLayers();

    const states = data.statesAt(year);

    // 疆域（异步加载几何，加载完后校验 token 仍有效再绘制）
    await Promise.all(
      states.map(async (s) => {
        const snap = data.territorySnapshotAt(s, year);
        if (!snap) return;
        const geo = await data.loadGeometry(snap.geometry_ref).catch(() => null);
        if (!geo || token !== renderToken) return;
        L.geoJSON(geo, {
          style: {
            color: s.color,
            weight: 1.5,
            fillColor: s.color,
            fillOpacity: 0.35,
          },
        })
          .bindTooltip(`${s.name} (${s.name_en})`, { sticky: true })
          .on("click", () => onSelect?.("state", s.id))
          .addTo(territoryLayer);
      })
    );
    if (token !== renderToken) return;

    // 都城标记
    for (const s of states) {
      for (const pid of s.capital_place_ids || []) {
        const place = data.get("place", pid);
        if (!place?.coord) continue;
        L.circleMarker([place.coord.lat, place.coord.lng], {
          radius: 5,
          color: "#222",
          weight: 1,
          fillColor: s.color,
          fillOpacity: 1,
        })
          .bindTooltip(`${place.name}（${s.name}都）`)
          .on("click", () => onSelect?.("place", place.id))
          .addTo(markerLayer);
      }
    }

    // 事件标记
    for (const ev of data.eventsAt(year)) {
      const place = ev.place_id && data.get("place", ev.place_id);
      if (!place?.coord) continue;
      L.marker([place.coord.lat, place.coord.lng], { opacity: 0.9 })
        .bindTooltip(`★ ${esc(ev.name)}`)
        .on("click", () => onSelect?.("event", ev.id))
        .addTo(markerLayer);
    }
  }

  function focusEntity(kind, id) {
    if (kind === "place") {
      const p = data.get("place", id);
      if (p?.coord) map.panTo([p.coord.lat, p.coord.lng]);
    } else if (kind === "event") {
      const p = data.get("place", data.get("event", id)?.place_id);
      if (p?.coord) map.panTo([p.coord.lat, p.coord.lng]);
    }
  }

  return { map, render, focusEntity };
}
