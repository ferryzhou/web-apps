#!/usr/bin/env python3
"""Build, validate, and generate weekly email digests for AI Agents in Practice.

Usage:
  python3 ai-agents-in-practice/build.py                 # Rebuild all HTML pages + feed.xml
  python3 ai-agents-in-practice/build.py --validate      # Rebuild + run full validation
  python3 ai-agents-in-practice/build.py --status        # Print roster & latest interview dates
  python3 ai-agents-in-practice/build.py --digest --since 2026-11-20 [--format html|markdown]
"""

from __future__ import annotations

import argparse
import html as html_lib
import json
import pathlib
import re
import sys
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import format_datetime
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parent
DATA_PATH = ROOT / "data.json"
PEOPLE_DIR = ROOT / "people"

MONTH_NAMES = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

VALID_STORY_TYPES = {
    "solved a problem",
    "built a feature",
    "launched something",
    "moved a metric",
}

FONTS_LINK = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
    'family=Fraunces:opsz,wght@9..144,600&family=Source+Sans+3:wght@400;600'
    '&family=IBM+Plex+Mono:wght@400&display=swap">'
)

VOID_TAGS = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
}


def esc(text: str) -> str:
    return html_lib.escape(str(text), quote=True)


def parse_iso_date(iso: str) -> datetime:
    return datetime.strptime(iso, "%Y-%m-%d").replace(tzinfo=timezone.utc)


def render_meta_link(iv: dict) -> str:
    cls_attr = "" if iv.get("link_style") == "text" else 'class="btn" '
    link = (
        f'<a {cls_attr}href="{esc(iv["url"])}" target="_blank" rel="noopener">'
        f'{esc(iv["link_label"])}</a>'
    )
    if iv.get("no_video"):
        link += ' <span class="src">(no video found)</span>'
    return link


def render_person_page(person: dict, site: dict) -> str:
    stories_by_id = {s["id"]: s for s in person["stories"]}
    told_in: dict[str, list[dict]] = {s["id"]: [] for s in person["stories"]}

    interviews = sorted(person["interviews"], key=lambda iv: iv["sort"], reverse=True)
    for iv in interviews:
        for sid in iv.get("stories", []):
            if sid in told_in:
                told_in[sid].append(iv)

    learnings_html = "".join(f"<li>{esc(item)}</li>" for item in person["learnings"])

    timeline_items = []
    for idx, iv in enumerate(interviews):
        cls = "entry latest" if idx == 0 else "entry"
        ins_html = "".join(f"<li>{esc(x)}</li>" for x in iv["insights"])
        story_links = " · ".join(
            f'<a href="#{esc(sid)}">{esc(stories_by_id[sid]["title"])}</a>'
            for sid in iv.get("stories", [])
            if sid in stories_by_id
        )
        told_html = f'<p class="told"><span>Stories:</span>{story_links}</p>' if story_links else ""
        timeline_items.append(
            f'<li class="{cls}" id="{esc(iv["id"])}">'
            f'<div class="meta"><span class="chip">{esc(iv["date"])}</span>'
            f'<strong>{esc(iv["show"])}</strong>{render_meta_link(iv)}</div>'
            f'<p class="show">{esc(iv["title"])}</p>'
            f'<ul class="ins">{ins_html}</ul>{told_html}</li>'
        )

    story_cards = []
    for st in person["stories"]:
        chips = f'<li class="chip ghost">{esc(st["type"])}</li>'
        if st.get("metric"):
            chips += f'<li class="chip">{esc(st["metric"])}</li>'
        details_html = "".join(f"<li>{esc(d)}</li>" for d in st["details"])
        if st.get("source_html"):
            src_inner = st["source_html"]
        else:
            src_inner = (
                f'<a href="{esc(st["source_url"])}" target="_blank" rel="noopener">'
                f'{esc(st["source_label"])}</a> · {esc(st["source_date"])}'
            )
        told_links = " · ".join(
            f'<a href="#{esc(iv["id"])}">{esc(iv["show"])}, {esc(iv["date"])}</a>'
            for iv in told_in[st["id"]]
        )
        told_html = f'<p class="told"><span>Told in:</span>{told_links}</p>' if told_links else ""
        story_cards.append(
            f'<article class="story" id="{esc(st["id"])}">'
            f'<h3>{esc(st["title"])}</h3>'
            f'<ul class="chips">{chips}</ul>'
            f'<p>{esc(st["summary"])}</p>'
            f'<details><summary>Details</summary><ul>{details_html}</ul></details>'
            f'<p class="src">Source: {src_inner}</p>{told_html}</article>'
        )

    years = sorted({iv["sort"][:4] for iv in interviews})
    year_label = years[0] if len(years) == 1 else f"{years[0]}–{years[-1]}"
    iv_word = "interview" if len(interviews) == 1 else "interviews"
    eyebrow = f'{person["role"]} · {person["org"]}' if person.get("org") else person["role"]

    return (
        "<!doctype html>\n"
        '<html lang="en">\n'
        "<head>\n"
        '<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        f'<title>{esc(person["name"])} on AI Agents</title>\n'
        f'<meta name="description" content="{esc(person["lede"])}">\n'
        f'<link rel="alternate" type="application/rss+xml" title="{esc(site["title"])}" href="../feed.xml">\n'
        f"{FONTS_LINK}\n"
        '<link rel="stylesheet" href="../style.css">\n'
        "</head>\n"
        "<body>\n"
        '<div class="wrap">\n'
        '<nav class="topnav" aria-label="Site">'
        f'<a class="brand" href="../index.html">{esc(site["title"])}</a>'
        '<a class="tab" href="../index.html">Latest</a>'
        '<a class="tab" href="../archive.html">All people</a>'
        '<a class="tab" href="../feed.xml">RSS</a>'
        "</nav>"
        f'<header><p class="eyebrow">{esc(eyebrow)}</p>'
        f'<h1>{esc(person["name"])}</h1>'
        f'<p class="lede">{esc(person["lede"])}</p>'
        f'<p class="now"><strong>Latest view ({esc(person["latest_date"])}):</strong> '
        f'{esc(person["latest_view"])}</p>'
        f'<ul class="chips"><li class="chip">{len(person["stories"])} agent stories</li>'
        f'<li class="chip ghost">{len(interviews)} {iv_word} in {year_label}</li></ul>'
        '<p class="told"><a href="#learnings">Consolidated learnings</a> · '
        '<a href="#timeline">Timeline</a> · <a href="#stories">Agent stories</a></p></header>'
        f'<h2 id="learnings">Consolidated learnings</h2><ul class="learn">{learnings_html}</ul>'
        f'<h2 id="timeline">Timeline, newest first</h2><ol class="timeline">{"".join(timeline_items)}</ol>'
        f'<h2 id="stories">Agent stories</h2><div class="stories">{"".join(story_cards)}</div>'
        '<section class="notes"><h2>Interview notes</h2>'
        f'<details><summary>{esc(person["notes_title"])}</summary>'
        f'<div class="body">{person["notes_html"]}</div></details></section>'
        f'<p class="caveat">{esc(person["caveat"])}</p>'
        "</div>\n"
        "</body>\n"
        "</html>\n"
    )


def collect_feed_entries(data: dict) -> list[tuple[dict, dict, dict]]:
    entries = []
    for person in data["people"]:
        smap = {s["id"]: s for s in person["stories"]}
        for iv in person["interviews"]:
            entries.append((person, iv, smap))
    entries.sort(key=lambda item: (item[1]["sort"], item[0]["name"]), reverse=True)
    # Tie-break same date alphabetically ascending by person name
    entries.sort(key=lambda item: (-int(item[1]["sort"].replace("-", "")), item[0]["name"].lower()))
    return entries


def render_index_page(data: dict) -> str:
    site = data["site"]
    entries = collect_feed_entries(data)
    total_interviews = len(entries)
    total_stories = sum(len(p["stories"]) for p in data["people"])
    total_people = len(data["people"])

    groups: list[tuple[str, list[tuple[dict, dict, dict]]]] = []
    for item in entries:
        y_str, m_str, _ = item[1]["sort"].split("-")
        label = f"{MONTH_NAMES[int(m_str)]} {y_str}"
        if not groups or groups[-1][0] != label:
            groups.append((label, []))
        groups[-1][1].append(item)

    groups_html = []
    for label, items in groups:
        lis = []
        for person, iv, smap in items:
            ins_html = "".join(f"<li>{esc(x)}</li>" for x in iv["insights"])
            story_links = " · ".join(
                f'<a href="people/{esc(person["slug"])}.html#{esc(sid)}">{esc(smap[sid]["title"])}</a>'
                for sid in iv.get("stories", [])
                if sid in smap
            )
            told_html = f'<p class="told"><span>Stories:</span>{story_links}</p>' if story_links else ""
            show_line = f'{person["org"]} · {iv["show"]}: {iv["title"]}' if person.get("org") else f'{iv["show"]}: {iv["title"]}'
            lis.append(
                f'<li class="entry">'
                f'<div class="meta"><span class="chip">{esc(iv["date"])}</span>{render_meta_link(iv)}</div>'
                f'<h3><a href="people/{esc(person["slug"])}.html">{esc(person["name"])}</a></h3>'
                f'<p class="show">{esc(show_line)}</p>'
                f'<ul class="ins">{ins_html}</ul>{told_html}</li>'
            )
        groups_html.append(f'<h2 class="month">{esc(label)}</h2><ol class="feed">{"".join(lis)}</ol>')

    return (
        "<!doctype html>\n"
        '<html lang="en">\n'
        "<head>\n"
        '<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        f'<title>{esc(site["title"])}</title>\n'
        f'<meta name="description" content="{esc(site["description"])}">\n'
        f'<link rel="alternate" type="application/rss+xml" title="{esc(site["title"])}" href="feed.xml">\n'
        f"{FONTS_LINK}\n"
        '<link rel="stylesheet" href="style.css">\n'
        "</head>\n"
        "<body>\n"
        '<div class="wrap">\n'
        '<nav class="topnav" aria-label="Site">'
        f'<a class="brand" href="index.html">{esc(site["title"])}</a>'
        '<a class="tab" href="index.html" aria-current="page">Latest</a>'
        '<a class="tab" href="archive.html">All people</a>'
        '<a class="tab" href="feed.xml">RSS</a>'
        "</nav>"
        "<header><h1>Latest updates</h1>"
        '<p class="lede">New interviews with founders, engineering leaders and hands-on developers '
        "running AI agents in practice, newest first. Each entry shows what was new in that interview. "
        'For each person\'s full picture, see <a href="archive.html">All people</a>.</p>'
        f'<ul class="chips"><li class="chip">{total_interviews} interviews</li>'
        f'<li class="chip ghost">{total_stories} stories</li>'
        f'<li class="chip ghost">{total_people} people</li></ul></header>'
        f'{"".join(groups_html)}'
        "</div>\n"
        "</body>\n"
        "</html>\n"
    )


def render_archive_page(data: dict) -> str:
    site = data["site"]
    sorted_people = sorted(data["people"], key=lambda p: p["slug"])
    cards = []
    for person in sorted_people:
        interviews = sorted(person["interviews"], key=lambda iv: iv["sort"], reverse=True)
        latest_date = interviews[0]["date"] if interviews else person["latest_date"]
        iv_word = "interview" if len(interviews) == 1 else "interviews"
        role_parts = [person["role"]]
        if person.get("org"):
            role_parts.append(person["org"])
        role_parts.append(f"{len(interviews)} {iv_word}, latest {latest_date}")

        hl_items = []
        for st in person["stories"]:
            metric_html = f' <span class="metric">{esc(st["metric"])}</span>' if st.get("metric") else ""
            hl_items.append(
                f'<li data-t="{esc(st["type"])}">'
                f'<a href="people/{esc(person["slug"])}.html#{esc(st["id"])}">{esc(st["title"])}</a>'
                f"{metric_html}</li>"
            )
        cards.append(
            f'<li class="person" id="{esc(person["slug"])}">'
            f'<h3><a href="people/{esc(person["slug"])}.html">{esc(person["name"])}</a></h3>'
            f'<p class="role">{esc(" · ".join(role_parts))}</p>'
            f'<p>{esc(person["latest_view"])}</p>'
            f'<ul class="highlights">{"".join(hl_items)}</ul>'
            f'<a class="more" href="people/{esc(person["slug"])}.html">'
            f'Read {esc(person["short_name"])}\'s page →</a></li>'
        )

    old_json = json.dumps(data.get("legacy_redirects", {}), ensure_ascii=False)
    return (
        "<!doctype html>\n"
        '<html lang="en">\n'
        "<head>\n"
        '<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        f'<title>All People · {esc(site["title"])}</title>\n'
        '<meta name="description" content="Every person\'s consolidated view: stories, learnings and interview timeline.">\n'
        f'<link rel="alternate" type="application/rss+xml" title="{esc(site["title"])}" href="feed.xml">\n'
        f"{FONTS_LINK}\n"
        '<link rel="stylesheet" href="style.css">\n'
        "</head>\n"
        "<body>\n"
        '<div class="wrap">\n'
        '<nav class="topnav" aria-label="Site">'
        f'<a class="brand" href="index.html">{esc(site["title"])}</a>'
        '<a class="tab" href="index.html">Latest</a>'
        '<a class="tab" href="archive.html" aria-current="page">All people</a>'
        '<a class="tab" href="feed.xml">RSS</a>'
        "</nav>"
        "<header><h1>All people</h1>"
        '<p class="lede">The full picture for each person: their interviews combined into one page '
        "with a timeline, agent stories and consolidated learnings.</p></header>"
        '<div class="toolbar" role="group" aria-label="Filter stories by type">'
        '<button type="button" data-f="all" aria-pressed="true">All</button>'
        '<button type="button" data-f="solved a problem" aria-pressed="false">Solved a problem</button>'
        '<button type="button" data-f="built a feature" aria-pressed="false">Built a feature</button>'
        '<button type="button" data-f="launched something" aria-pressed="false">Launched something</button>'
        '<button type="button" data-f="moved a metric" aria-pressed="false">Moved a metric</button>'
        "</div>"
        f'<ul class="people">{"".join(cards)}</ul>'
        "<script>\n"
        'const btns=[...document.querySelectorAll(".toolbar button")];\n'
        'btns.forEach(b=>b.addEventListener("click",()=>{const f=b.dataset.f;btns.forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));\n'
        'document.querySelectorAll(".person").forEach(p=>{let n=0;p.querySelectorAll(".highlights li").forEach(li=>{const ok=f==="all"||li.dataset.t===f;li.hidden=!ok;if(ok)n++;});p.hidden=n===0;});}));\n'
        "</script><script>\n"
        f"const OLD={old_json};\n"
        'const h=location.hash.slice(1); if(OLD[h]) location.replace("people/"+OLD[h]+".html");\n'
        "</script></div>\n"
        "</body>\n"
        "</html>\n"
    )


def render_rss_feed(data: dict, limit: int = 30) -> str:
    site = data["site"]
    base_url = site["base_url"].rstrip("/") + "/"
    entries = collect_feed_entries(data)[:limit]
    last_build = format_datetime(datetime.now(timezone.utc))

    items_xml = []
    for person, iv, smap in entries:
        item_url = f'{base_url}people/{person["slug"]}.html#{iv["id"]}'
        pub_date = format_datetime(parse_iso_date(iv["sort"]))
        bullets = "".join(f"<li>{esc(x)}</li>" for x in iv["insights"])
        stories_html = ""
        if iv.get("stories"):
            s_links = " · ".join(
                f'<a href="{esc(base_url)}people/{esc(person["slug"])}.html#{esc(sid)}">'
                f'{esc(smap[sid]["title"])}</a>'
                for sid in iv["stories"]
                if sid in smap
            )
            stories_html = f"<p><strong>Stories:</strong> {s_links}</p>"
        desc_html = (
            f'<p><strong>{esc(person["name"])}</strong> ({esc(person["org"])}) — '
            f'{esc(iv["show"])}: {esc(iv["title"])}</p>'
            f"<ul>{bullets}</ul>"
            f'{stories_html}'
            f'<p><a href="{esc(iv["url"])}">{esc(iv["link_label"])}</a> · '
            f'<a href="{esc(base_url)}people/{esc(person["slug"])}.html">Full profile</a></p>'
        )
        items_xml.append(
            "    <item>\n"
            f'      <title>{esc(person["name"])} — {esc(iv["show"])}: {esc(iv["title"])}</title>\n'
            f"      <link>{esc(item_url)}</link>\n"
            f'      <guid isPermaLink="true">{esc(item_url)}</guid>\n'
            f"      <pubDate>{esc(pub_date)}</pubDate>\n"
            f"      <description>{esc(desc_html)}</description>\n"
            "    </item>"
        )

    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n'
        "  <channel>\n"
        f'    <title>{esc(site["title"])}</title>\n'
        f"    <link>{esc(base_url)}</link>\n"
        f'    <atom:link href="{esc(base_url)}feed.xml" rel="self" type="application/rss+xml"/>\n'
        f'    <description>{esc(site["description"])}</description>\n'
        "    <language>en-us</language>\n"
        f"    <lastBuildDate>{esc(last_build)}</lastBuildDate>\n"
        + "\n".join(items_xml)
        + "\n  </channel>\n"
        "</rss>\n"
    )


def build_all(data: dict) -> None:
    PEOPLE_DIR.mkdir(exist_ok=True)
    for person in data["people"]:
        out = PEOPLE_DIR / f'{person["slug"]}.html'
        out.write_text(render_person_page(person, data["site"]), encoding="utf-8")
    (ROOT / "index.html").write_text(render_index_page(data), encoding="utf-8")
    (ROOT / "archive.html").write_text(render_archive_page(data), encoding="utf-8")
    (ROOT / "feed.xml").write_text(render_rss_feed(data), encoding="utf-8")


class TagBalanceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.stack: list[str] = []
        self.errors: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        if tag not in VOID_TAGS:
            self.stack.append(tag)

    def handle_endtag(self, tag: str) -> None:
        if tag in VOID_TAGS:
            return
        if not self.stack or self.stack[-1] != tag:
            self.errors.append(f"Mismatched </{tag}> at {self.getpos()}")
        else:
            self.stack.pop()


def validate(data: dict) -> list[str]:
    errors: list[str] = []
    slugs = set()

    for person in data["people"]:
        slug = person["slug"]
        if slug in slugs:
            errors.append(f"Duplicate person slug: {slug}")
        slugs.add(slug)

        story_ids = set()
        for st in person["stories"]:
            if st["id"] in story_ids:
                errors.append(f"{slug}: duplicate story id {st['id']}")
            story_ids.add(st["id"])
            if st["type"] not in VALID_STORY_TYPES:
                errors.append(f"{slug}/{st['id']}: invalid story type {st['type']!r}")
            for field in (st["title"], st["summary"], *st["details"]):
                if "`" in field:
                    errors.append(f"{slug}/{st['id']}: raw backtick in prose")

        iv_ids = set()
        for iv in person["interviews"]:
            if iv["id"] in iv_ids:
                errors.append(f"{slug}: duplicate interview id {iv['id']}")
            iv_ids.add(iv["id"])
            try:
                parse_iso_date(iv["sort"])
            except ValueError:
                errors.append(f"{slug}/{iv['id']}: invalid sort date {iv['sort']!r}")
            for sid in iv.get("stories", []):
                if sid not in story_ids:
                    errors.append(f"{slug}/{iv['id']}: missing story ref {sid}")
            for ins in iv["insights"]:
                if "`" in ins:
                    errors.append(f"{slug}/{iv['id']}: raw backtick in insight")

    # Validate generated HTML & internal links
    html_files = [ROOT / "index.html", ROOT / "archive.html", *sorted(PEOPLE_DIR.glob("*.html"))]
    for hf in html_files:
        txt = hf.read_text(encoding="utf-8")
        parser = TagBalanceParser()
        parser.feed(txt)
        if parser.errors:
            errors.append(f"{hf.name}: {parser.errors[0]}")
        if parser.stack:
            errors.append(f"{hf.name}: unclosed tags {parser.stack}")
        for href in re.findall(r'href="(people/[^"]+)"', txt):
            target = href.split("#")[0]
            if not (ROOT / target).exists():
                errors.append(f"{hf.name}: broken link {href}")

    # Validate feed.xml
    try:
        ET.fromstring((ROOT / "feed.xml").read_text(encoding="utf-8"))
    except ET.ParseError as exc:
        errors.append(f"feed.xml XML error: {exc}")

    return errors


def print_status(data: dict) -> None:
    entries = collect_feed_entries(data)
    total_stories = sum(len(p["stories"]) for p in data["people"])
    latest = entries[0][1]["sort"] if entries else "n/a"
    print(f'Site: {data["site"]["title"]}')
    print(f'URL:  {data["site"]["base_url"]}')
    print(f'Last updated metadata: {data["site"].get("last_updated", "n/a")}')
    print(f"Totals: {len(data['people'])} people, {len(entries)} interviews, {total_stories} stories")
    print(f"Latest interview date: {latest}\n")
    print(f"{'Slug':26s} {'Interviews':>10s} {'Stories':>8s}  {'Latest'}")
    print("-" * 60)
    for p in sorted(data["people"], key=lambda x: x["slug"]):
        p_latest = max((iv["sort"] for iv in p["interviews"]), default="n/a")
        print(f"{p['slug']:26s} {len(p['interviews']):10d} {len(p['stories']):8d}  {p_latest}")


def render_digest(data: dict, since: str | None, latest_n: int | None, fmt: str) -> str:
    site = data["site"]
    base_url = site["base_url"].rstrip("/") + "/"
    entries = collect_feed_entries(data)
    if since:
        selected = [e for e in entries if e[1]["sort"] >= since]
    else:
        selected = entries[: (latest_n or 5)]

    header_scope = f"since {since}" if since else f"latest {len(selected)}"
    subject = f'AI Agents in Practice — Weekly Update ({len(selected)} new interview{"s" if len(selected) != 1 else ""})'

    if not selected:
        return f"Subject: {subject}\n\nNo new interviews found ({header_scope}).\n"

    if fmt == "html":
        blocks = []
        for person, iv, smap in selected:
            profile_url = f'{base_url}people/{person["slug"]}.html'
            entry_url = f'{profile_url}#{iv["id"]}'
            bullets = "".join(f"<li>{esc(x)}</li>" for x in iv["insights"])
            stories_html = ""
            if iv.get("stories"):
                s_links = " · ".join(
                    f'<a href="{esc(profile_url)}#{esc(sid)}">{esc(smap[sid]["title"])}</a>'
                    for sid in iv["stories"]
                    if sid in smap
                )
                stories_html = f'<p style="font-size:13px;color:#5d6a63;"><strong>Stories:</strong> {s_links}</p>'
            blocks.append(
                '<div style="border:1px solid #dde3df;border-radius:8px;padding:14px 16px;margin:12px 0;background:#ffffff;">'
                f'<div style="font-size:12px;color:#1f6f5c;font-family:monospace;">{esc(iv["date"])} · {esc(person["org"])}</div>'
                f'<h3 style="margin:4px 0;"><a href="{esc(profile_url)}" style="color:#1f6f5c;">{esc(person["name"])}</a></h3>'
                f'<p style="margin:2px 0 8px;color:#5d6a63;font-size:14px;">{esc(iv["show"])}: {esc(iv["title"])}</p>'
                f'<ul style="margin:0 0 8px;padding-left:20px;font-size:14px;line-height:1.5;">{bullets}</ul>'
                f"{stories_html}"
                f'<p style="margin:6px 0 0;font-size:13px;">'
                f'<a href="{esc(iv["url"])}" style="color:#1f6f5c;font-weight:600;">{esc(iv["link_label"])}</a> · '
                f'<a href="{esc(entry_url)}" style="color:#1f6f5c;">View on site</a></p>'
                "</div>"
            )
        return (
            f"<!-- Subject: {esc(subject)} -->\n"
            '<div style="font-family:system-ui,-apple-system,sans-serif;max-width:680px;margin:0 auto;color:#1d2420;">'
            f'<h2 style="margin-bottom:4px;">{esc(site["title"])} — Weekly Digest</h2>'
            f'<p style="color:#5d6a63;margin-top:0;">{len(selected)} interviews ({esc(header_scope)}) · '
            f'<a href="{esc(base_url)}" style="color:#1f6f5c;">Browse full site</a> · '
            f'<a href="{esc(base_url)}archive.html" style="color:#1f6f5c;">All {len(data["people"])} people</a></p>'
            + "".join(blocks)
            + "</div>\n"
        )

    lines = [
        f"Subject: {subject}",
        "",
        f"AI Agents in Practice — {len(selected)} interviews ({header_scope})",
        f"Live site: {base_url}",
        "",
    ]
    for person, iv, smap in selected:
        profile_url = f'{base_url}people/{person["slug"]}.html'
        lines.append(f'### {person["name"]} ({person["org"]}) — {iv["date"]}')
        lines.append(f'{iv["show"]}: {iv["title"]}')
        lines.append(f'Watch/Read: {iv["url"]} | Profile: {profile_url}')
        for ins in iv["insights"]:
            lines.append(f"- {ins}")
        if iv.get("stories"):
            s_titles = "; ".join(smap[sid]["title"] for sid in iv["stories"] if sid in smap)
            lines.append(f"Stories: {s_titles}")
        lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Build & validate AI Agents in Practice.")
    parser.add_argument("--validate", action="store_true", help="Run full validation after building.")
    parser.add_argument("--status", action="store_true", help="Show roster and latest interview dates.")
    parser.add_argument("--digest", action="store_true", help="Print weekly email digest instead of building.")
    parser.add_argument("--since", help="ISO date YYYY-MM-DD for --digest filter.")
    parser.add_argument("--latest", type=int, help="Number of latest interviews for --digest.")
    parser.add_argument("--format", choices=["markdown", "html"], default="markdown", help="Digest output format.")
    args = parser.parse_args()

    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))

    if args.status:
        print_status(data)
        return 0

    if args.digest:
        print(render_digest(data, args.since, args.latest, args.format))
        return 0

    build_all(data)
    total_iv = sum(len(p["interviews"]) for p in data["people"])
    total_st = sum(len(p["stories"]) for p in data["people"])
    print(f"Built {len(data['people'])} person pages, index.html, archive.html, and feed.xml ({total_iv} interviews, {total_st} stories).")

    if args.validate:
        errors = validate(data)
        if errors:
            print("VALIDATION FAILED:", file=sys.stderr)
            for err in errors:
                print(f"  - {err}", file=sys.stderr)
            return 1
        print("Validation passed: 0 errors.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
