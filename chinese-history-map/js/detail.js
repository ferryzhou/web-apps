// 实体详情面板：展示字段，并把关联实体渲染成可点击的链接（点击触发跳转）。
import * as data from "./data.js";
import { esc, formatSpan } from "./util.js";

const KIND_LABEL = { state: "政权", person: "人物", place: "地点", event: "事件" };

// 关联实体链接（chip），点击由面板的事件委托处理
const link = (kind, id) => {
  const e = data.get(kind, id);
  if (!e) return "";
  return `<button class="chip" data-link data-kind="${kind}" data-id="${esc(id)}">${esc(e.name)}</button>`;
};
const links = (kind, ids) => (ids || []).map((id) => link(kind, id)).join(" ") || "—";

function section(title, body) {
  return body ? `<div class="sec"><h3>${esc(title)}</h3><div>${body}</div></div>` : "";
}

function renderState(s) {
  const events = data.events.filter((e) => (e.state_ids || []).includes(s.id));
  return [
    `<p class="muted">存续：${formatSpan(s.existence)}</p>`,
    `<p>${esc(s.description || "")}</p>`,
    section("都城", links("place", s.capital_place_ids)),
    section("关键人物", links("person", s.ruler_person_ids)),
    section("相关事件", events.map((e) => link("event", e.id)).join(" ")),
  ].join("");
}

function renderPerson(p) {
  const aka = p.aka?.length ? `（${p.aka.map(esc).join("、")}）` : "";
  return [
    p.life ? `<p class="muted">${formatSpan(p.life)}</p>` : "",
    p.title ? `<p><strong>${esc(p.title)}</strong>${aka}</p>` : aka ? `<p>${aka}</p>` : "",
    p.roles?.length ? `<p class="muted">${p.roles.map(esc).join(" · ")}</p>` : "",
    `<p>${esc(p.description || "")}</p>`,
    section("所属", link("state", p.state_id)),
    section("出生地", p.birth_place_id ? link("place", p.birth_place_id) : ""),
    section("参与事件", links("event", p.event_ids)),
  ].join("");
}

function renderPlace(pl) {
  const events = data.events.filter((e) => e.place_id === pl.id);
  const capitalOf = data.states.filter((s) => (s.capital_place_ids || []).includes(pl.id));
  return [
    pl.modern_name ? `<p class="muted">${esc(pl.modern_name)}</p>` : "",
    pl.type ? `<p class="muted">类型：${esc(pl.type)}</p>` : "",
    `<p>${esc(pl.description || "")}</p>`,
    section("所属都城", capitalOf.map((s) => link("state", s.id)).join(" ")),
    section("相关事件", events.map((e) => link("event", e.id)).join(" ")),
  ].join("");
}

function renderEvent(ev) {
  return [
    `<p class="muted">${formatSpan(ev.date)}${ev.type ? " · " + esc(ev.type) : ""}</p>`,
    `<p>${esc(ev.description || "")}</p>`,
    ev.outcome ? `<p><strong>结果：</strong>${esc(ev.outcome)}</p>` : "",
    section("地点", ev.place_id ? link("place", ev.place_id) : ""),
    section("涉及政权", links("state", ev.state_ids)),
    section("关键人物", links("person", ev.person_ids)),
  ].join("");
}

const RENDERERS = {
  state: renderState,
  person: renderPerson,
  place: renderPlace,
  event: renderEvent,
};

export function initDetail(panel, navigate) {
  panel.addEventListener("click", (e) => {
    const t = e.target.closest("[data-link]");
    if (t) navigate(t.dataset.kind, t.dataset.id);
    if (e.target.closest("[data-close]")) panel.hidden = true;
  });

  function show(kind, id) {
    const entity = data.get(kind, id);
    if (!entity) return;
    const sub = entity.name_en ? ` <span class="en">${esc(entity.name_en)}</span>` : "";
    panel.innerHTML = `
      <button class="close" data-close aria-label="关闭">×</button>
      <span class="kind">${KIND_LABEL[kind]}</span>
      <h2>${esc(entity.name)}${sub}</h2>
      ${RENDERERS[kind](entity)}`;
    panel.hidden = false;
    panel.scrollTop = 0;
  }

  return { show, hide: () => (panel.hidden = true) };
}
