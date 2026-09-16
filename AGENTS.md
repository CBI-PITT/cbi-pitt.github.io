# AGENTS.md

Static Eleventy site (Center for Biologic Imaging, Univ. of Pittsburgh). No framework, no TypeScript, no tests/lint/typecheck.

## Commands
- `npm run dev` — dev server with live reload at http://localhost:8080
- `npm run build` — builds into `_site/`; **the only verification step** — run after any change
- `cd _site && python3 -m http.server 8000` — preview production build
- CI (`.github/workflows/deploy.yml`) runs `npm ci && npm run build` on every push to `main` and deploys `_site/` to GitHub Pages (`cbipitt.github.io`). No other CI checks exist.

## How content works
- All page content lives in `_data/*.json` and `news/*.md`. The `*.njk` templates are page structure — don't hardcode content in them.
- News posts: one markdown file per post in `news/` with frontmatter (`title`, `date`, `image`, `permalink: /news/<slug>.html`, `layout: base`).
- **Gotcha:** `_data/news_list.json` is unused/stale. The news list comes from the `news` collection in `.eleventy.js` (glob over `news/*.md`). Don't edit `news_list.json`.
- `_data/<name>.json` auto-feeds the template with the same name (e.g. `location.json` → `location.njk`) via Eleventy's data cascade.
- Shared layout is `_includes/base.njk` (sidebar nav, footer, contact panel, lightbox). New pages need `layout: base` and a nav entry in `base.njk`.
- Custom Nunjucks filters (`asset`, `displayDate`, `stripDash`, `isDashItem`) are defined in `.eleventy.js`.
- Images/docs go under `assets/images/<category>/` or `assets/docs/`; reference by relative path in the data files. `.eleventy.js` passthrough-copies `assets/`, `css/`, `js/`.

## Gotchas
- `_site/` and `node_modules/` are gitignored build output — never edit or commit.
- News frontmatter dates: existing files use YAML dates (`2026-09-03`); sorting uses `new Date()`, so string dates also work.
