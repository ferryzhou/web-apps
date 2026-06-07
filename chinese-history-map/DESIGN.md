# 中国历史地图 · 设计文档

> 一个数据驱动的中国历史交互地图网站。通过时间轴在地图上展示历代疆域变迁，
> 并把**人物、地点、事件、政权**作为相互关联的实体串联起来。

## 1. 项目目标

- **核心体验**：拖动时间轴，地图实时显示该时刻各政权的疆域、都城、关键地点；
  点击任意实体（政权 / 人物 / 地点 / 事件）弹出详情，并能跳转到与之关联的其他实体。
- **可持续维护**：内容（数据）与展现（代码）彻底分离。新增一个朝代或一场战役
  只需编辑 JSON，无需改动渲染逻辑。
- **轻量静态**：纯静态站点，部署在 GitHub Pages，无后端、无构建步骤（或仅极轻量构建），
  延续本仓库"单文件可上手、移动端可审阅"的风格，但代码按职责拆分到多个文件。

## 2. 现状与迁移

当前 `chinese-history-map/index.html`（约 1400 行）是一个可用的 demo：

- 用 Google Maps + 时间轴滑块，数据**硬编码**在 `historicalData` 对象里。
- 结构为 `periods[] → kingdoms[]`，每个 kingdom 含 `coordinates`(多边形)、`capital`、
  `description`、`events[]`、`characters[]`。
- 已覆盖战国时期数据，是很好的内容来源。
- 问题：① 人物/事件被埋在 kingdom 里、无法跨政权复用或独立检索；
  ② 数据与代码耦合，难扩展；③ 文件里**硬编码了 Google Maps API key**（安全隐患）。

**迁移策略（已决定）**：

1. 重构为**数据驱动**架构，实体数据抽到独立 JSON 文件。
2. 地图引擎从 Google Maps 换成 **Leaflet + MapLibre**（开源、免 API key）。
3. 把现有战国数据作为第一批内容，按新数据模型重新组织。
4. 旧 `index.html` 在新版稳定前保留可访问，迁移完成后替换。

## 3. 数据模型

设计原则：**实体规范化（normalized） + 通过 ID 互相引用 + 时间是一等维度**。
所有实体共享一套统一的时间表示，地图/时间轴/关系图都消费同一份数据。

### 3.1 时间表示

- 统一用**儒略年整数**：公元前为负数，公元后为正数，**没有 0 年**（-1 即公元前 1 年）。
  - 例：`-475` = 公元前 475 年；`221` = 公元 221 年；秦统一 `-221`。
- 时间区间统一写成 `{ "start": -475, "end": -221 }`。
- 展示层负责把 `-221` 渲染成「公元前 221 年 / 221 BC」。

### 3.2 实体总览

| 实体 | 文件 | 说明 |
|------|------|------|
| 时期 Period | `data/periods.json` | 朝代/历史分期，时间轴的刻度锚点 |
| 政权 State | `data/states.json` | 国家/政权，含**随时间变化的疆域快照** |
| 人物 Person | `data/people.json` | 君主、将领、谋士、文人等 |
| 地点 Place | `data/places.json` | 都城、城市、关隘、战场等带坐标的点 |
| 事件 Event | `data/events.json` | 战役、改革、建国、迁都等时间点/段 |

实体之间通过 `*_id` / `*_ids` 字段引用，形成一张图：

```
        ┌─────────┐
        │ Period  │  时间分期
        └────┬────┘
             │ contains
        ┌────▼────┐  rules ┌──────────┐
        │  State  │◄───────┤  Person  │ 人物隶属/效力于政权
        └────┬────┘        └────┬─────┘
   territory │                  │ participates
     (随时间) │                  │
        ┌────▼─────────┐   ┌────▼────┐ located_at ┌────────┐
        │ Territory     │   │  Event  ├───────────►│ Place  │
        │ snapshots     │   └─────────┘            └────────┘
        └───────────────┘
```

### 3.3 关键设计：疆域随时间变化

疆域是会变的——这是历史地图的核心难点。我们不把多边形直接挂在 State 上，
而是给每个 State 一组**疆域快照（territory snapshots）**，每个快照标注它生效的年份/区间：

```jsonc
// states.json 中的一个 State
{
  "id": "qin",
  "name": "秦",
  "name_en": "Qin",
  "color": "#8B0000",
  "existence": { "start": -770, "end": -207 },   // 该政权存续时间
  "capital_place_ids": ["xianyang"],             // 引用 places
  "ruler_person_ids": ["yingzheng", "shangyang"],// 关键人物（引用 people）
  "description": "战国七雄之一，地处西陲，因商鞅变法而强盛，最终统一六国。",
  "territories": [                                // 疆域快照，按时间排序
    {
      "as_of": -350,                             // 该形态生效起始年
      "geometry_ref": "territories/qin/-350.geojson"
    },
    {
      "as_of": -250,
      "geometry_ref": "territories/qin/-250.geojson"
    }
  ]
}
```

**渲染规则**：在时间轴年份 `Y` 时，对每个 `existence` 覆盖 `Y` 的 State，
取 `as_of <= Y` 中最大的那个快照绘制。这样地图能随时间"长大/缩小"。

> 几何数据用标准 **GeoJSON**（`Polygon`/`MultiPolygon`），存在 `data/territories/` 下，
> 按需懒加载。小型多边形也可内联，但推荐外置以便单独迭代和复用工具编辑。

### 3.4 各实体 Schema

**Person 人物**
```jsonc
{
  "id": "yingzheng",
  "name": "嬴政",
  "name_en": "Ying Zheng",
  "aka": ["秦始皇", "Qin Shi Huang"],   // 别名/谥号/称号
  "life": { "start": -259, "end": -210 },
  "state_id": "qin",                     // 主要所属政权
  "roles": ["君主"],                      // 君主/将领/谋士/文人...
  "title": "秦王 → 始皇帝",
  "description": "完成统一的第一位皇帝。",
  "event_ids": ["qin-unification"],      // 参与的关键事件
  "birth_place_id": "handan"             // 可选
}
```

**Place 地点**
```jsonc
{
  "id": "xianyang",
  "name": "咸阳",
  "name_en": "Xianyang",
  "modern_name": "今陕西咸阳",
  "type": "capital",                     // capital/city/pass/battlefield/river...
  "coord": { "lat": 34.27, "lng": 108.95 },
  "description": "秦国都城。"
}
```

**Event 事件**
```jsonc
{
  "id": "changping",
  "name": "长平之战",
  "name_en": "Battle of Changping",
  "type": "battle",                      // battle/reform/founding/relocation...
  "date": { "start": -262, "end": -260 },
  "place_id": "changping-field",         // 发生地点（引用 places）
  "state_ids": ["qin", "zhao"],          // 涉及政权
  "person_ids": ["baiqi", "lianpo"],     // 关键人物
  "description": "秦赵决战，秦将白起大胜，坑杀赵卒，奠定秦国优势。",
  "outcome": "秦胜，赵国元气大伤。"
}
```

**Period 时期**
```jsonc
{
  "id": "warring-states",
  "name": "战国",
  "name_en": "Warring States",
  "span": { "start": -475, "end": -221 },
  "map_view": { "center": { "lat": 35.0, "lng": 110.0 }, "zoom": 5 },
  "description": "七雄并立，群雄逐鹿，终于秦的统一。"
}
```

### 3.5 数据完整性约定

- 所有 `id` 全局唯一、小写短横线（kebab-case），稳定不变（外链/书签依赖它）。
- 所有引用字段（`*_id`/`*_ids`）必须指向存在的实体——用一个校验脚本保证（见 ROADMAP）。
- 坐标统一 WGS84（lat/lng）。
- 一切以可考据的史料为准；不确定的边界/年代在 `description` 里注明，不臆造精确数字。

## 4. 应用架构

```
chinese-history-map/
├── index.html              # 应用外壳：地图容器 + 时间轴 + 详情面板
├── css/
│   └── style.css
├── js/
│   ├── app.js              # 初始化、状态管理、模块编排
│   ├── data.js             # 加载/索引 JSON，提供 byId / 时间查询
│   ├── map.js              # Leaflet 地图、疆域与地点图层渲染
│   ├── timeline.js         # 时间轴滑块、播放、年份联动
│   └── detail.js           # 实体详情面板 + 关联实体跳转
├── data/
│   ├── periods.json
│   ├── states.json
│   ├── people.json
│   ├── places.json
│   ├── events.json
│   └── territories/        # 各政权疆域 GeoJSON（按年份快照）
├── tools/
│   └── validate.mjs        # 数据校验脚本（引用完整性、id 唯一）
├── DESIGN.md               # 本文档
├── ROADMAP.md              # 开发计划
└── README.md               # 使用说明
```

### 4.1 渲染数据流

```
时间轴年份 Y  ──►  data.js 查询  ──►  { 当前 states + territories + 该时刻 events/places }
                                          │
                          ┌───────────────┼───────────────┐
                          ▼               ▼               ▼
                       map.js          timeline.js      detail.js
                  (画疆域/标记)      (高亮区间/事件)   (点击→详情→关联跳转)
```

### 4.2 技术选型

| 关注点 | 选择 | 理由 |
|--------|------|------|
| 地图引擎 | **Leaflet**（起步）/ 可选 MapLibre GL | 开源、免 key、API 简单、生态成熟 |
| 底图 | 浅色/灰阶瓦片（如 CARTO Light）或无底图纯地形 | 历史地图不需要现代行政边界喧宾夺主 |
| 几何格式 | **GeoJSON** | 标准、工具链丰富（geojson.io 可手绘） |
| 前端 | **原生 ES Modules**，无框架 | 符合本仓库"轻量、可移动端审阅"理念 |
| 数据校验 | Node 脚本（仅本地/CI 用） | 保证引用完整性，不进运行时 |

> 起步用 Leaflet（最简单）。若后续需要平滑缩放、矢量样式、3D，可平移到 MapLibre GL，
> 数据层（GeoJSON）无需改动。

## 5. 交互设计要点

- **时间轴**：连续滑块 + 朝代刻度；支持点击刻度跳转、自动播放（按年递进）。
- **地图**：政权填色多边形 + 都城/地点标记；hover 高亮，点击出详情。
- **详情面板**：展示实体字段，并列出**关联实体的可点击链接**
  （如点开「秦」→ 列出其君主、都城、参与的战役，逐一可跳转）。
- **可分享**：URL 带 `?year=-260&focus=qin`，刷新/分享后还原到同一视图。
- **可访问性 & 移动端**：语义化 HTML、键盘可操作时间轴、详情面板在窄屏改为底部抽屉。

## 6. 非目标（当前阶段不做）

- 不做用户登录、编辑后台、数据库——内容靠 PR 编辑 JSON。
- 不追求疆域边界的学术级精确（先"形似可读"，再逐步精修，并标注存疑）。
- 不做全文检索引擎 / 多语言 i18n 框架（中文为主，英文字段并存即可）。
