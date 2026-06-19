#!/usr/bin/env node
// 数据校验：id 唯一、引用完整、时间合法、geojson 几何有效。
// 用法：node tools/validate.mjs   （在 chinese-history-map/ 目录下运行）
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const err = (msg) => errors.push(msg);

const load = async (rel) => JSON.parse(await readFile(join(root, "data", rel), "utf8"));

// 几何校验：Polygon/MultiPolygon，环闭合、点数 >= 4、坐标落在中国范围内
const inChina = ([lng, lat]) => lng >= 70 && lng <= 140 && lat >= 15 && lat <= 55;
async function checkGeometry(rel, where) {
  let geo;
  try { geo = await load(rel); } catch { return err(`${where}: 无法读取/解析几何 ${rel}`); }
  if (geo.type !== "Feature" || !geo.geometry) return err(`${where}: ${rel} 不是 Feature`);
  const g = geo.geometry;
  if (g.type !== "Polygon" && g.type !== "MultiPolygon")
    return err(`${where}: ${rel} 几何类型应为 Polygon/MultiPolygon`);
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  for (const poly of polys) {
    for (const ring of poly) {
      if (ring.length < 4) err(`${where}: ${rel} 环点数不足 (${ring.length})`);
      const a = ring[0], b = ring[ring.length - 1];
      if (a[0] !== b[0] || a[1] !== b[1]) err(`${where}: ${rel} 环未闭合（首尾不一致）`);
      for (const pt of ring) if (!inChina(pt)) err(`${where}: ${rel} 坐标越界 ${JSON.stringify(pt)}`);
    }
  }
}

const [periods, states, people, places, events] = await Promise.all([
  load("periods.json"), load("states.json"), load("people.json"),
  load("places.json"), load("events.json"),
]);

// 1) id 唯一（按实体类型）
const idSets = {};
for (const [kind, list] of Object.entries({ periods, states, people, places, events })) {
  const seen = new Set();
  for (const e of list) {
    if (!e.id) err(`${kind}: 存在缺少 id 的条目`);
    else if (seen.has(e.id)) err(`${kind}: id 重复 "${e.id}"`);
    seen.add(e.id);
  }
  idSets[kind] = seen;
}

const ref = (kind, id, where) => {
  if (id != null && !idSets[kind].has(id)) err(`${where}: 引用了不存在的 ${kind} id "${id}"`);
};
const span = (s, where) => {
  if (!s) return;
  if (typeof s.start !== "number" || typeof s.end !== "number") err(`${where}: 时间区间需为数字`);
  else if (s.start > s.end) err(`${where}: start(${s.start}) 晚于 end(${s.end})`);
};

// 2) 引用完整性 + 时间合法
for (const p of periods) span(p.span, `period ${p.id}`);

for (const s of states) {
  span(s.existence, `state ${s.id}`);
  (s.capital_place_ids || []).forEach((id) => ref("places", id, `state ${s.id}.capital_place_ids`));
  (s.ruler_person_ids || []).forEach((id) => ref("people", id, `state ${s.id}.ruler_person_ids`));
  for (const t of s.territories || []) {
    if (typeof t.as_of !== "number") err(`state ${s.id}: territory.as_of 需为数字`);
    if (!t.geometry_ref) err(`state ${s.id}: territory 缺少 geometry_ref`);
    else await checkGeometry(t.geometry_ref, `state ${s.id}`);
  }
}

for (const p of people) {
  span(p.life, `person ${p.id}`);
  ref("states", p.state_id, `person ${p.id}.state_id`);
  ref("places", p.birth_place_id, `person ${p.id}.birth_place_id`);
  (p.event_ids || []).forEach((id) => ref("events", id, `person ${p.id}.event_ids`));
}

for (const e of events) {
  span(e.date, `event ${e.id}`);
  ref("places", e.place_id, `event ${e.id}.place_id`);
  (e.state_ids || []).forEach((id) => ref("states", id, `event ${e.id}.state_ids`));
  (e.person_ids || []).forEach((id) => ref("people", id, `event ${e.id}.person_ids`));
}

const counts = `periods=${periods.length} states=${states.length} people=${people.length} places=${places.length} events=${events.length}`;
if (errors.length) {
  console.error(`✗ 校验失败（${errors.length} 个问题）：`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
} else {
  console.log(`✓ 数据校验通过：${counts}`);
}
