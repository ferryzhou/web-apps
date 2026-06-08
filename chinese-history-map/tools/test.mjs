#!/usr/bin/env node
// 单元测试：针对真实数据，验证 data.js 的时间查询 / 疆域快照逻辑与 util.js 的格式化。
// 用法：node tools/test.mjs   （在 chinese-history-map/ 目录下运行）
//
// data.js 用相对路径 fetch JSON；这里把全局 fetch 重定向到本地文件，从而测试真实模块。
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
globalThis.fetch = async (url) => {
  const body = await readFile(join(root, url), "utf8");
  return { ok: true, status: 200, json: async () => JSON.parse(body) };
};

const data = await import(join(root, "js/data.js"));
const { formatYear, formatSpan, esc } = await import(join(root, "js/util.js"));
await data.loadAll();

let passed = 0;
const fails = [];
const eq = (name, got, want) => {
  if (JSON.stringify(got) === JSON.stringify(want)) passed++;
  else fails.push(`${name}\n      got:  ${JSON.stringify(got)}\n      want: ${JSON.stringify(want)}`);
};

// —— 时间查询：某年存续的政权 ——
eq("statesAt(-260) 返回战国七雄",
  data.statesAt(-260).map((s) => s.id).sort(),
  ["chu", "han-state", "qi", "qin", "wei", "yan", "zhao"]);
eq("statesAt(-205) 楚汉相争：西楚与汉并立",
  data.statesAt(-205).map((s) => s.id).sort(),
  ["western-chu", "western-han"]);
eq("statesAt(-100) 仅西汉存续", data.statesAt(-100).map((s) => s.id), ["western-han"]);

// —— 疆域快照：取 as_of <= year 中最大者 ——
const qin = data.get("state", "qin");
eq("territorySnapshotAt(qin,-300) -> -350 快照", data.territorySnapshotAt(qin, -300).as_of, -350);
eq("territorySnapshotAt(qin,-240) -> -250 快照", data.territorySnapshotAt(qin, -240).as_of, -250);
eq("territorySnapshotAt(qin,-210) -> -221 统一快照", data.territorySnapshotAt(qin, -210).as_of, -221);
eq("territorySnapshotAt(qin,-400) -> 早于首个快照返回 null", data.territorySnapshotAt(qin, -400), null);

// —— 事件：按日期区间激活 ——
eq("eventsAt(-260) 含长平之战", data.eventsAt(-260).map((e) => e.id), ["changping"]);
eq("eventsAt(-227) 含荆轲刺秦且统一进行中",
  data.eventsAt(-227).map((e) => e.id).sort(),
  ["jingke-assassination", "qin-unification"]);
eq("eventsAt(-202) 含垓下之战与西汉建立",
  data.eventsAt(-202).map((e) => e.id).sort(),
  ["gaixia", "han-founding"]);

// —— 全局年份范围（所有时期 span 的并集）——
eq("yearRange 覆盖战国到西汉末", data.yearRange(), { min: -475, max: 8 });

// —— 离散时间点 ——
const tp = data.timePoints();
eq("timePoints 共 14 个", tp.length, 14);
eq("timePoints 首点 = 商鞅变法(-350)", tp[0], { year: -350, label: "商鞅变法" });
eq("timePoints 末点 = 张骞通西域(-138)", tp[tp.length - 1], { year: -138, label: "张骞通西域" });
eq("timePoints 年份递增", tp.map((p) => p.year), [...tp.map((p) => p.year)].sort((a, b) => a - b));
eq("timePoints -221 标签为「秦」", tp.find((p) => p.year === -221)?.label, "秦");
eq("timePoints 每点都能渲染至少一块疆域",
  tp.every((p) => data.statesAt(p.year).some((s) => data.territorySnapshotAt(s, p.year))), true);
eq("timePoints 丢弃无疆域可渲染的早期年份(-453)", tp.some((p) => p.year === -453), false);

// —— 集合的实时绑定：loadAll 后 data.* 应已填充（timeline.js / detail.js 依赖）——
eq("data.periods 已加载", data.periods.length, 4);
eq("data.states 已加载", data.states.length, 9);
eq("data.events 已加载", data.events.length, 14);
eq("data.people 已加载", data.people.length, 30);
eq("data.places 已加载", data.places.length, 14);

// —— 索引与引用 ——
eq("get 按 id 取实体", data.get("person", "baiqi")?.name, "白起");

// —— util 格式化 ——
eq("formatYear 公元前", formatYear(-221), "公元前 221 年");
eq("formatYear 公元后", formatYear(8), "公元 8 年");
eq("formatSpan 单点年份只显示一次", formatSpan({ start: -341, end: -341 }), "公元前 341 年");
eq("formatSpan 区间", formatSpan({ start: -262, end: -260 }), "公元前 262 年 – 公元前 260 年");
eq("esc 转义 HTML", esc('<a>"&'), "&lt;a&gt;&quot;&amp;");

if (fails.length) {
  console.error(`✗ 测试失败（${fails.length}/${passed + fails.length}）：`);
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log(`✓ 测试通过：${passed} 项`);
