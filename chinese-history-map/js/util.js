// 公用小工具

// 把整数年渲染为中文（无 0 年：-1 即公元前 1 年）
export function formatYear(y) {
  return y < 0 ? `公元前 ${-y} 年` : `公元 ${y} 年`;
}

// 渲染时间区间，单点则只显示一个年份
export function formatSpan(span) {
  if (!span) return "";
  return span.start === span.end
    ? formatYear(span.start)
    : `${formatYear(span.start)} – ${formatYear(span.end)}`;
}

// 极简 HTML 转义，防止数据中的特殊字符破坏渲染
export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}
