# 中国历史地图 · Chinese History Map

数据驱动的中国历史交互地图。拖动时间轴，在地图上查看历代**疆域**随时间的变化，
并浏览相互关联的**人物、地点、事件、政权**。

**在线访问**：https://ferryzhou.github.io/web-apps/chinese-history-map/

## 功能

- **时间轴**：连续滑块 + 朝代刻度 + 自动播放，地图随年份实时重绘。
- **疆域变迁**：每个政权有多个带生效年份的疆域快照，地图按当前年份选取正确形态。
- **实体详情**：点击疆域/都城/事件标记弹出详情，并可在关联实体间跳转
  （如：秦 → 白起 → 长平之战 → 赵）。
- **可分享**：URL 带 `?year=-260&focus=state:qin`，刷新或分享后还原视图。
- **移动端**：详情面板在窄屏自动变为底部抽屉。

## 本地运行

因为用到 ES Modules 与 `fetch` 加载 JSON，需通过静态服务器访问（不能直接 `file://` 打开）：

```bash
cd chinese-history-map
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

> 地图库 Leaflet 通过 CDN 加载，运行时需联网。

## 项目结构

```
index.html            应用外壳（地图 + 时间轴 + 详情面板）
css/style.css
js/
  app.js              编排：加载数据、连接各模块、URL 状态
  data.js             数据加载、索引、按时间查询
  map.js              Leaflet 渲染（疆域/都城/事件）
  timeline.js         时间轴滑块与播放
  detail.js           实体详情面板与关联跳转
  util.js             年份格式化等
data/                 规范化数据（见 DESIGN.md 第 3 节）
  periods/states/people/places/events.json
  territories/        各政权疆域 GeoJSON（按年份快照）
tools/validate.mjs    数据校验（id 唯一、引用完整、时间合法）
```

## 数据与贡献

- 数据模型与设计：见 [DESIGN.md](./DESIGN.md)
- 开发计划与路线：见 [ROADMAP.md](./ROADMAP.md)
- 新增/修改内容只需编辑 `data/*.json`，疆域多边形可用 [geojson.io](https://geojson.io) 手绘。
- 提交前请运行校验：

```bash
node tools/validate.mjs
```

> 当前内容覆盖**战国七雄**（约公元前 350–221 年）；疆域边界为近似示意，仍在逐步精修。
