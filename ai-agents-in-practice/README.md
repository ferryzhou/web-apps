# AI Agents in Practice

Real stories of AI agents solving problems, shipping features and moving business numbers, from 20 founders, engineering leaders and hands-on developers (37signals/Rails, Datasette, Ghostty/Superlogical, OpenClaw, Flask/Earendil, Gas Town, Anthropic, OpenAI, Shopify, Vercel, Ramp, Klarna, Sierra, Linear, SaaStr, Every, Sendbird).

- `index.html` (Latest): every interview across all people, newest first, grouped by month, with what was new in each one.
- `archive.html` (All people): each person's latest view and headline stories, filterable by story type.
- `people/<slug>.html`: one person's full picture: latest view, consolidated learnings, a newest-first timeline of their interviews (what each one added, and which stories it told), agent stories with sources, and interview notes.
- `feed.xml`: RSS 2.0 feed of the latest 30 interviews.

Static HTML with a shared `style.css`, no build step at deploy time. Content is stored in `data.json` and rebuilt with `python3 ai-agents-in-practice/build.py --validate` (use `--status` to inspect coverage or `--digest --since YYYY-MM-DD` to generate a weekly email digest). Numbers are the guests' own claims unless a source says otherwise.
