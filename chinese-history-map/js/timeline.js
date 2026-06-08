// 时间轴：连续滑块 + 播放 + 朝代刻度。
import * as data from "./data.js";
import { formatYear } from "./util.js";

export function initTimeline({ slider, display, playBtn, ticks }, onChange) {
  const { min, max } = data.yearRange();
  slider.min = min;
  slider.max = max;
  slider.step = 1;

  // 朝代刻度
  if (ticks) {
    ticks.innerHTML = "";
    for (const p of data.periods) {
      const left = ((p.span.start - min) / (max - min)) * 100;
      const el = document.createElement("button");
      el.className = "tick";
      el.style.left = `${left}%`;
      el.textContent = p.name;
      el.title = p.name_en;
      el.addEventListener("click", () => setYear(p.span.start));
      ticks.appendChild(el);
    }
  }

  let current = +slider.value || min;
  let timer = null;

  function setYear(year, fire = true) {
    current = Math.max(min, Math.min(max, Math.round(year)));
    slider.value = current;
    display.textContent = formatYear(current);
    if (fire) onChange(current);
  }

  slider.addEventListener("input", () => setYear(+slider.value));

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    playBtn.textContent = "▶ 播放";
    playBtn.setAttribute("aria-pressed", "false");
  }
  function play() {
    if (current >= max) setYear(min);
    playBtn.textContent = "⏸ 暂停";
    playBtn.setAttribute("aria-pressed", "true");
    timer = setInterval(() => {
      if (current >= max) return stop();
      setYear(current + 2);
    }, 120);
  }
  playBtn.addEventListener("click", () => (timer ? stop() : play()));

  return { setYear, getYear: () => current };
}
