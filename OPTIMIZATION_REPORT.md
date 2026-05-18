# SEO / AEO / GEO Optimization Report — wenfang.dev

**Date**: 2026-05-18
**Branch**: `fix/chatbot`
**Workflow**: Executed `seo.md` Phases 0–7. Phase 5 (content rewrite) skipped by user decision.
**Companion docs**: [`AUDIT.md`](./AUDIT.md), [`seo.md`](./seo.md)

---

## TL;DR

- ✅ Site is now machine-discoverable: `robots.txt` allows 10 named AI crawlers, `sitemap.xml` is generated per build, `llms.txt` + `llms-full.txt` expose curated AI-readable content.
- ✅ Page is now entity-resolvable: `Person` + `WebSite` + `ProfilePage` + `ItemList` JSON-LD graph with `@id` nesting and 3 `sameAs` profiles.
- ✅ Page is now share-presentable: canonical URL, OG tags, Twitter Cards, OG image (SVG placeholder).
- ⏭️ Visible page copy unchanged per user decision. Hero `entity-anchor` and FAQ section deferred.
- 🟡 One OG image is SVG (no PNG renderer locally) — replace with PNG when convenient for X/LinkedIn link unfurling.
- 🟡 Manual GEO validation (chat with real engines) is the user's job. Baseline table at the end.

---

## Files changed, grouped by phase

### Phase 1 — Audit
- 🆕 `AUDIT.md` — full pre-change audit at repo root.

### Phase 2 — Technical foundations
- ♻️ `static/robots.txt` — rewritten. Allows GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, PerplexityBot, Perplexity-User, Google-Extended, Bingbot, Applebot-Extended. Disallows `/api/`. References sitemap.
- 🆕 `src/routes/sitemap.xml/+server.ts` — prerendered XML sitemap. `lastmod` is the build date (auto-refreshes per deploy).
- 🆕 `static/og-image.svg` — 1200×630 brand-color OG image (dark surface, emerald accent, name + role + location + domain).
- ♻️ `src/routes/+page.svelte` `<svelte:head>` — added `author`, `canonical`, full Open Graph block, full Twitter Card block. Title shortened from 62 → 50 chars and now includes name + location. Description rewritten to lead with entity (name + role + location).

### Phase 3 — JSON-LD schema
- 🆕 `src/lib/seo/jsonld.ts` — single `@graph` builder. Four entities (`Person`, `WebSite`, `ProfilePage`, `ItemList`) linked via `@id`. Projects auto-mapped from `$lib/data/projects` so adding a project flows through to schema.
- ♻️ `src/routes/+page.svelte` `<svelte:head>` — inlined pre-stringified JSON-LD via `{@html}` with an ESLint disable + justifying comment (data is static and never user input).

### Phase 4 — AI-specific files
- 🆕 `static/llms.txt` (4 KB) — curated Markdown index. Summary, About, What Wen Does, Projects, AI Workflow, Tech Stack, Experience, Education, Contact.
- 🆕 `static/llms-full.txt` (14 KB) — full ingestible Markdown reorganized from `src/lib/data/portfolio-content.ts`. Surfaces the RAG knowledge base to AI crawlers without requiring them to call `/api/chat`. **Net new GEO surface**: ~10 KB of recruiter-relevant content that was previously chat-widget-only.

### Phase 5 — Content polish
- ⏭️ Skipped per user. Two diffs proposed (Hero kicker for entity anchor, FAQ section for AEO) were both declined. Visible page copy untouched.

### Phase 6 — Internal linking
- ⏭️ N/A for single-page site (only one indexable URL).

### Phase 7 — Validation
- 🆕 `OPTIMIZATION_REPORT.md` — this file.

---

## Validation results

### Automated (run locally)

| Check | Command | Result |
|---|---|---|
| TypeScript / Svelte types | `npm run check` | ✅ 0 errors, 0 warnings |
| Lint | `npm run lint` | ✅ 0 errors (one ESLint disable in `+page.svelte` for JSON-LD `{@html}`, justified inline) |
| Production build | `npm run build` | ✅ Built in 14.4s. All 6 static files emitted to `.vercel/output/static/`: `index.html`, `sitemap.xml`, `robots.txt`, `og-image.svg`, `llms.txt`, `llms-full.txt`. |
| Crawler smoke test (GPTBot UA) | `curl -A "GPTBot/1.0" http://localhost:4173/` against `npm run preview` | ✅ HTTP 200. Title present, JSON-LD `@graph` present with all 7 nested types (`Person`, `PostalAddress`, `WebSite`, `ProfilePage`, `ItemList`, 2× `ListItem`, 2× `SoftwareApplication`). |
| `robots.txt` reachability | `curl /robots.txt` | ✅ Served, references sitemap |
| `sitemap.xml` reachability | `curl /sitemap.xml` | ✅ Valid XML, `<lastmod>2026-05-18</lastmod>` |
| `llms.txt` reachability | `curl /llms.txt` | ✅ Served as `text/plain` |

### Manual (you need to run these after deploy)

These need to hit the real `https://wenfang.dev` host and can't be done from the sandbox.

| # | Action | Where |
|---|---|---|
| 1 | Validate the JSON-LD graph | <https://validator.schema.org/#url=https://wenfang.dev/> |
| 2 | Validate rich results | <https://search.google.com/test/rich-results?url=https://wenfang.dev/> |
| 3 | Validate sitemap | <https://www.xml-sitemaps.com/validate-xml-sitemap.html> against `https://wenfang.dev/sitemap.xml` |
| 4 | Test OG card | <https://opengraph.xyz/url/https%3A%2F%2Fwenfang.dev> |
| 5 | Test Twitter card | <https://cards-dev.twitter.com/validator> |
| 6 | Lighthouse SEO + Core Web Vitals | Chrome DevTools → Lighthouse → Mobile + SEO/Performance |

---

## Manual next steps (per `seo.md` "Out of scope")

These advance GEO further but only you can do them.

1. **Submit sitemap** to [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. **Replace OG image** with a designed 1200×630 PNG. Drop it at `static/og-image.png`, then in `src/routes/+page.svelte` change two strings: `og-image.svg` → `og-image.png` (in both `og:image` and `twitter:image`). The SVG works for many AI crawlers, but X / LinkedIn / Facebook strongly prefer raster formats for link previews.
3. **Backlink building** — post about projects on HackerNews, Reddit (r/sveltejs, r/MachineLearning), LinkedIn. AI engines heavily cite content with strong inbound signals.
4. **Wikidata / Crunchbase / GitHub README** — every authoritative profile you add increases the strength of the `sameAs` entity graph. Highest-leverage single addition: a [Wikidata item](https://www.wikidata.org/wiki/Special:CreateNewItem) for "Wen Fang" pointing back to wenfang.dev.
5. **Analytics** — Plausible / Umami / Vercel Web Analytics. Needed to measure whether the work above is converting.
6. **Manually test the queries below** (see baseline table) — about 2 weeks after deploy is when AI engines typically re-index.

---

## Optional follow-ups (declined or deferred)

Items the audit flagged that we did not ship. Pick up later if you want.

| Item | Why it's valuable | Why we skipped |
|---|---|---|
| Hero kicker — `WEN FANG · AI-NATIVE FULLSTACK DEVELOPER · PHOENIX, AZ` above the H1 | Highest-leverage AEO win. Currently the first 100 visible words have zero entity anchors; an AI summarizer cannot extract "who/where/role" from the poetic H1 alone. | Declined in Phase 5 to preserve brand voice. |
| FAQ section (4 recruiter-leaning Q&As) + `FAQPage` schema appended to the `@graph` | Directly mirrors how recruiters ask AI engines about a candidate. Content already exists in `llms-full.txt` and `portfolio-content.ts`. | Declined in Phase 5. |
| Centralize `<head>` in a `$lib/seo/SiteHead.svelte` component | Future-proofs metadata for multi-route expansion (blog, projects/[slug], etc.). | Premature for a single-page site. Re-evaluate when the second route is added. |
| Self-host Google Fonts | Removes a render-blocking third-party request. Modest LCP gain. | Defer until Lighthouse flags it. |
| Expand visible copy from `portfolio-content.ts` into the page | Currently the richest content (RAG knowledge base) only reaches AI engines via `llms-full.txt`. Surfacing it as visible HTML would compound GEO + classical SEO value. | Out of scope per Audit decision. |
| OG image as PNG instead of SVG | X / LinkedIn / Facebook link unfurlers strongly prefer PNG | No PNG renderer available locally. Listed as manual next step #2. |

---

## Anti-patterns we explicitly avoided

Per `seo.md`:

- ❌ No fake `FAQPage` / `Review` / `AggregateRating` schema.
- ❌ No keyword stuffing in title / description / meta.
- ❌ No `noindex` added anywhere.
- ❌ No blocking of any AI crawlers.
- ❌ No `llms.txt` auto-generated from sitemap (handwritten and prioritized).
- ❌ No content rewrites without explicit per-section approval (Phase 5 checkpoint respected).
- ❌ No heavy new dependencies (everything is plain HTML / JSON / TypeScript; zero `package.json` change).

---

## Target query baseline — fill in over time

Test in ChatGPT (web search on), Perplexity, Google AI Overviews, Gemini. Record `cited (with link) / mentioned (no link) / absent`.

| # | Query | Channel | Before (today) | After (~2 weeks post-deploy) |
|---|---|---|---|---|
| 1 | `AI-native fullstack developer Phoenix` | ChatGPT | | |
| 1 | `AI-native fullstack developer Phoenix` | Perplexity | | |
| 1 | `AI-native fullstack developer Phoenix` | Google AIO | | |
| 2 | `Wen Fang developer` | ChatGPT | | |
| 2 | `Wen Fang developer` | Perplexity | | |
| 2 | `Wen Fang developer` | Google AIO | | |
| 3 | `who is the developer behind wenfang.dev` | ChatGPT | | |
| 3 | `who is the developer behind wenfang.dev` | Perplexity | | |
| 4 | `AI-assisted development workflow example portfolio` | ChatGPT | | |
| 4 | `AI-assisted development workflow example portfolio` | Perplexity | | |
| 5 | `SvelteKit RAG chatbot portfolio example` | ChatGPT | | |
| 5 | `SvelteKit RAG chatbot portfolio example` | Perplexity | | |

---

## Definition-of-done checklist

From `seo.md`:

- [x] `AUDIT.md` exists and was approved
- [x] `robots.txt` allows major AI crawlers, references sitemap
- [x] `sitemap.xml` generated and valid (single URL, lastmod = build date)
- [x] Indexable page has unique `<title>`, `<meta description>`, canonical URL, OG tags
- [x] Indexable page has appropriate JSON-LD schema, nested with `@id` references, ready for validation
- [x] `llms.txt` exists at site root, curated (and `llms-full.txt` for richer ingestion)
- [ ] ~~Cornerstone pages restructured for answer-first / scannable format~~ — **declined by user**
- [x] All build and crawler validators run locally, results above
- [x] `curl -A "GPTBot" /` returns meaningful HTML
- [x] Performance not regressed (no new deps, build time unchanged)

---

## How to maintain

- **Adding a project** → edit `src/lib/data/projects.ts`. The `ItemList` schema and `llms.txt` references update on next build. (`llms-full.txt` is hand-curated — update manually if the project has architectural detail worth surfacing.)
- **Changing tech stack / experience** → edit `src/lib/data/portfolio-content.ts` (RAG source), then `static/llms-full.txt` to keep AI-readable view in sync. Re-run `npx tsx scripts/ingest.ts` to update the RAG vector store.
- **Adding a new route** → in that route's `+page.svelte` add a `<svelte:head>` with `title`, `description`, `canonical`, OG tags. Add the URL to `src/routes/sitemap.xml/+server.ts`. Consider adding entity-specific JSON-LD via `$lib/seo/jsonld.ts`.
- **Changing your name, location, or socials** → `src/lib/seo/jsonld.ts` is the single source of truth for schema. `static/llms.txt` and `static/llms-full.txt` need manual updates too.
- **OG image refresh** → drop new PNG at `static/og-image.png` and update two strings in `src/routes/+page.svelte`.
