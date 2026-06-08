#!/usr/bin/env node
// 浏览器冒烟测试：用无头 Chromium 真正加载页面，验证地图渲染、时间轴与详情面板。
// 捕获 Node 单元测试无法覆盖的 DOM/集成问题（如模块绑定、点击事件接线）。
//
// 依赖 Playwright（非默认安装）：
//   npm i -D playwright && npx playwright install chromium
//   node tools/smoke.mjs
// 若未安装 Playwright，则跳过（退出码 0），不阻断 CI。
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.log("· 跳过浏览器冒烟测试：未安装 Playwright（见文件头注释）。");
  process.exit(0);
}

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".geojson": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml",
};

const server = createServer(async (req, res) => {
  try {
    const rel = normalize(decodeURIComponent(req.url.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
    const file = join(root, rel === "/" ? "index.html" : rel);
    const body = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
});

await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
const page = await ctx.newPage();

// 只关心 JS 运行时错误；外部瓦片（CARTO）加载失败属预期，忽略
const jsErrors = [];
page.on("pageerror", (e) => jsErrors.push(e.message));

const fails = [];
try {
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelectorAll("#map svg path").length > 0, { timeout: 8000 })
    .catch(() => {});

  const year = (await page.textContent("#year")) || "";
  const paths = await page.locator("#map svg path").count();
  if (!year) fails.push("时间轴年份未显示（#year 为空）");
  if (paths === 0) fails.push("地图未渲染任何疆域多边形");

  // 点击一块疆域，应弹出详情面板并显示标题
  if (paths > 0) {
    await page.locator("#map svg path").first().click({ force: true });
    await page.waitForTimeout(300);
    const visible = await page.locator("#detail").isVisible();
    const title = (await page.textContent("#detail h2").catch(() => "")) || "";
    if (!visible) fails.push("点击疆域后详情面板未显示");
    if (!title.trim()) fails.push("详情面板标题为空");
  }

  if (jsErrors.length) fails.push("页面 JS 报错：\n      " + jsErrors.join("\n      "));
  console.log(`  年份=${JSON.stringify(year)} 疆域多边形=${paths}`);
} finally {
  await browser.close();
  server.close();
}

if (fails.length) {
  console.error(`✗ 冒烟测试失败（${fails.length}）：`);
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log("✓ 浏览器冒烟测试通过：地图渲染、时间轴、详情面板均正常。");
