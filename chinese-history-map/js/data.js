// 数据层：加载规范化 JSON，建立索引，提供按时间查询的 API。
// 几何（GeoJSON）按需懒加载并缓存。
//
// 集合以 `export let` 暴露，loadAll() 内部重新赋值——ES 模块的实时绑定（live binding）
// 使得 `import * as data` 的 data.periods / data.states / data.events 在加载后自动可见。

const DATA_DIR = "data";

export let periods = [];
export let states = [];
export let people = [];
export let places = [];
export let events = [];

let byId = { period: {}, state: {}, person: {}, place: {}, event: {} };
const geoCache = new Map();

const indexBy = (list) => Object.fromEntries(list.map((e) => [e.id, e]));

const fetchJson = (name) =>
  fetch(`${DATA_DIR}/${name}.json`).then((r) => {
    if (!r.ok) throw new Error(`加载 ${name}.json 失败：${r.status}`);
    return r.json();
  });

export async function loadAll() {
  [periods, states, people, places, events] = await Promise.all(
    ["periods", "states", "people", "places", "events"].map(fetchJson)
  );
  byId = {
    period: indexBy(periods),
    state: indexBy(states),
    person: indexBy(people),
    place: indexBy(places),
    event: indexBy(events),
  };
  return { periods, states, people, places, events };
}

export const get = (kind, id) => byId[kind]?.[id];

// 时间区间是否覆盖某年
const covers = (span, year) => span && year >= span.start && year <= span.end;

// 某年存续的政权
export const statesAt = (year) => states.filter((s) => covers(s.existence, year));

// 某年正在发生的事件
export const eventsAt = (year) => events.filter((e) => covers(e.date, year));

// 取政权在某年生效的疆域快照（as_of <= year 中最大者）
export function territorySnapshotAt(stateObj, year) {
  const snaps = (stateObj.territories || [])
    .filter((t) => t.as_of <= year)
    .sort((a, b) => b.as_of - a.as_of);
  return snaps[0] || null;
}

// 懒加载并缓存某个 geometry_ref 对应的 GeoJSON
export async function loadGeometry(ref) {
  if (geoCache.has(ref)) return geoCache.get(ref);
  const geo = await fetch(`${DATA_DIR}/${ref}`).then((r) => {
    if (!r.ok) throw new Error(`加载几何 ${ref} 失败：${r.status}`);
    return r.json();
  });
  geoCache.set(ref, geo);
  return geo;
}

// 时间轴的全局年份范围（取所有时期 span 的并集）
export function yearRange() {
  const starts = periods.map((p) => p.span.start);
  const ends = periods.map((p) => p.span.end);
  return { min: Math.min(...starts), max: Math.max(...ends) };
}
