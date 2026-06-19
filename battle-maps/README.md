# 东晋征战图录 · Eastern Jin Campaign Atlas (317–420)

An interactive, clickable atlas of the major military campaigns and battles of the Eastern Jin dynasty (东晋, 317–420 CE).

**Live:** [https://ferryzhou.github.io/web-apps/battle-maps/](https://ferryzhou.github.io/web-apps/battle-maps/)

## About

`index.html` is the hub: a parchment-styled timeline grouping twenty campaigns into four eras (立国与内忧 · 桓温时代 · 谢氏与淝水 · 朱世风云). Each entry links to its own self-contained interactive battle map. Cards are color-coded by outcome — 晋胜/克复 (win), 晋败/失地 (loss), 先胜后挫 (mixed), 内乱·平定 (civil war).

## Maps

The hub links to the following individual map pages (added incrementally):

| Year | Battle | File |
|------|--------|------|
| 313–321 | 祖逖北伐 | `zuti-313.html` |
| 322 / 324 | 王敦之乱 | `wangdun-322.html` |
| 327–329 | 苏峻之乱 | `sujun-327.html` |
| 339 | 邾城之战 | `zhucheng-339.html` |
| 347 | 桓温灭成汉 | `chenghan-347.html` |
| 352–353 | 殷浩北伐 | `yinhao-352.html` |
| 354 | 桓温第一次北伐 | `huanwen-1-354.html` |
| 356 | 桓温第二次北伐·伊水 | `huanwen-2-356.html` |
| 369 | 桓温第三次北伐·枋头 | `huanwen-3-369.html` |
| 378–379 | 襄阳之战 | `xiangyang-379.html` |
| 378–379 | 淮南三阿之战 | `sanya-379.html` |
| 383 | 淝水之战 | `feishui-383.html` |
| 384–385 | 谢玄北伐 | `xiexuan-384.html` |
| 399–402 | 孙恩起义 | `sunen-399.html` |
| 404 | 刘裕讨桓玄·覆舟山 | `huanxuan-404.html` |
| 409–410 | 刘裕灭南燕 | `nanyan-410.html` |
| 410–411 | 卢循之乱·左里 | `luxun-411.html` |
| 413 | 刘裕灭谯蜀 | `qiaoshu-413.html` |
| 416–417 | 刘裕灭后秦 | `houqin-417.html` |

## Adding a new map

1. Build the map as a self-contained HTML page in this folder, named to match the `href` above (e.g. `feishui-383.html`).
2. Match the hub's parchment aesthetic so the set feels consistent.
3. The hub already links to it — no edit needed unless you add a new battle.
