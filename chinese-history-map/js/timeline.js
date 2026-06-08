// 时间轴：离散时间点（取代连续滑块）。点击或用方向键在历史时刻间切换。
import * as data from "./data.js";
import { formatYear } from "./util.js";

const shortYear = (y) => (y < 0 ? `前${-y}` : `${y}`);

export function initTimeline({ points, display, playBtn }, onChange) {
  const pts = data.timePoints();
  let idx = 0;
  let timer = null;

  points.innerHTML = "";
  const buttons = pts.map((p, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "point";
    b.dataset.year = p.year;
    b.innerHTML =
      `<span class="point-year">${shortYear(p.year)}</span>` +
      `<span class="point-label">${p.label}</span>`;
    b.addEventListener("click", () => setIndex(i));
    points.appendChild(b);
    return b;
  });

  function setIndex(i, fire = true) {
    idx = Math.max(0, Math.min(pts.length - 1, i));
    const { year, label } = pts[idx];
    buttons.forEach((b, j) => {
      const active = j === idx;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", active ? "true" : "false");
    });
    buttons[idx].scrollIntoView({ block: "nearest", inline: "center" });
    display.textContent = `${formatYear(year)} · ${label}`;
    if (fire) onChange(year);
  }

  // 吸附到最近的离散点（用于 URL/默认年份）
  function setYear(year, fire = true) {
    let best = 0;
    for (let i = 1; i < pts.length; i++) {
      if (Math.abs(pts[i].year - year) < Math.abs(pts[best].year - year)) best = i;
    }
    setIndex(best, fire);
  }

  // 键盘左右切换
  points.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setIndex(idx + 1); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setIndex(idx - 1); }
  });

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    playBtn.textContent = "▶ 播放";
    playBtn.setAttribute("aria-pressed", "false");
  }
  function play() {
    if (idx >= pts.length - 1) setIndex(0);
    playBtn.textContent = "⏸ 暂停";
    playBtn.setAttribute("aria-pressed", "true");
    timer = setInterval(() => {
      if (idx >= pts.length - 1) return stop();
      setIndex(idx + 1);
    }, 1500);
  }
  playBtn.addEventListener("click", () => (timer ? stop() : play()));

  return { setYear, getYear: () => pts[idx].year };
}
