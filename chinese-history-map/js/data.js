// 数据层：加载规范化 JSON，建立索引，提供按时间查询的 API。
// 几何（GeoJSON）按需懒加载并缓存。

const DATA_DIR = "data";

const state = {
  periods: [],
  states: [],
  people: [],
  places: [],
  events: [],
  byId: { period: {}, state: {}, person: {}, place: {}, event: {} },
  _geoCache: new Map(),
};

const indexBy = (list) => Object.fromEntries(list.map((e) => [e.id, e]));

export async function loadAll() {
  const files = ["periods", "states", "people", "places", "events"];
  const [periods, states, people, places, events] = await Promise.all(
    files.map((f) => fetch(`${DATA_DIR}/${f}.json`).then((r) => {
      if (!r.ok) throw new Error(`加载 ${f}.json 失败：${r.status}`);
      return r.json();
    }))
  );
  Object.assign(state, { periods, states, people, places, events });
  state.byId = {
    period: indexBy(periods),
    state: indexBy(states),
    person: indexBy(people),
    place: indexBy(places),
    event: indexBy(events),
  };
  return state;
}

export const get = (kind, id) => state.byId[kind]?.[id];
export const all = (kind) => state[kind + "s"] ?? state[kind] ?? [];

// 时间区间是否覆盖某年
const covers = (span, year) => span && year >= span.start && year <= span.end;

// 某年存续的政权
export const statesAt = (year) =>
  state.states.filter((s) => covers(s.existence, year));

// 某年正在发生的事件
export const eventsAt = (year) =>
  state.events.filter((e) => covers(e.date, year));

// 取政权在某年生效的疆域快照（as_of <= year 中最大者）
export function territorySnapshotAt(stateObj, year) {
  const snaps = (stateObj.territories || [])
    .filter((t) => t.as_of <= year)
    .sort((a, b) => b.as_of - a.as_of);
  return snaps[0] || null;
}

// 懒加载并缓存某个 geometry_ref 对应的 GeoJSON
export async function loadGeometry(ref) {
  if (state._geoCache.has(ref)) return state._geoCache.get(ref);
  const geo = await fetch(`${DATA_DIR}/${ref}`).then((r) => {
    if (!r.ok) throw new Error(`加载几何 ${ref} 失败：${r.status}`);
    return r.json();
  });
  state._geoCache.set(ref, geo);
  return geo;
}

// 时间轴的全局年份范围（取所有时期 span 的并集）
export function yearRange() {
  const starts = state.periods.map((p) => p.span.start);
  const ends = state.periods.map((p) => p.span.end);
  return { min: Math.min(...starts), max: Math.max(...ends) };
}
