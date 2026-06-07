// 应用编排：加载数据，连接地图、时间轴与详情面板，处理可分享的 URL 状态。
import { loadAll, yearRange } from "./data.js";
import { initMap } from "./map.js";
import { initTimeline } from "./timeline.js";
import { initDetail } from "./detail.js";

const $ = (sel) => document.querySelector(sel);

function readUrl() {
  const p = new URLSearchParams(location.search);
  const year = p.has("year") ? +p.get("year") : null;
  const focus = p.get("focus"); // 形如 "state:qin"
  const [kind, id] = focus ? focus.split(":") : [];
  return { year, kind, id };
}

function writeUrl(year, kind, id) {
  const p = new URLSearchParams();
  p.set("year", year);
  if (kind && id) p.set("focus", `${kind}:${id}`);
  history.replaceState(null, "", `?${p}`);
}

async function main() {
  try {
    await loadAll();
  } catch (err) {
    $("#map").innerHTML = `<p class="error">数据加载失败：${err.message}</p>`;
    return;
  }

  const { min, max } = yearRange();
  const url = readUrl();
  let currentYear = url.year ?? -260; // 默认：长平之战前后
  let selected = url.kind && url.id ? { kind: url.kind, id: url.id } : null;

  const detail = initDetail($("#detail"), (kind, id) => select(kind, id));
  const mapView = initMap("map", { onSelect: (kind, id) => select(kind, id) });

  const timeline = initTimeline(
    { slider: $("#slider"), display: $("#year"), playBtn: $("#play"), ticks: $("#ticks") },
    (year) => {
      currentYear = year;
      mapView.render(year);
      writeUrl(year, selected?.kind, selected?.id);
    }
  );

  function select(kind, id) {
    selected = { kind, id };
    detail.show(kind, id);
    mapView.focusEntity(kind, id);
    writeUrl(currentYear, kind, id);
  }

  // 首次渲染
  timeline.setYear(Math.max(min, Math.min(max, currentYear)));
  if (selected) select(selected.kind, selected.id);
}

main();
