# SEO / AEO / GEO Audit — wenfang.dev

**Date**: 2026-05-18
**Auditor**: Claude (executing `seo.md` Phase 1)
**Scope**: Personal portfolio of Wen Fang. Single-page SvelteKit app, prerendered, deployed to Vercel.

This audit is read-only. No code changes have been made. Next phases require your approval at the end of this file.

---

## Phase 0 inputs (confirmed)

| Field | Value |
|---|---|
| Domain | `wenfang.dev` |
| Person | Wen Fang |
| Location | Phoenix, Arizona, USA |
| Title | AI Web Fullstack Developer |
| Languages | English |
| Contact email | `me@wenfang.dev` |
| GitHub | `https://github.com/wenF7752` |
| X (Twitter) | `https://x.com/WenTradeFuture` |
| LinkedIn | `https://www.linkedin.com/in/wenf7752/` |
| Site purpose | Personal site showcasing projects + AI development workflow |
| Primary audience | Potential recruiters (with peers + clients secondary) |
| OG image | Not yet provided — phase 2 will create a temporary text-based one |
| Index policy (my call) | Index everything; disallow `/api/*` only |

---

## 1.1 Rendering & crawlability

| Check | Status | Notes |
|---|---|---|
| Rendered HTML without JS | ✅ Pass | `+layout.ts` has `prerender = true`. SvelteKit builds static HTML for `/`. AI crawlers will receive full content, no JS-only render. **No P0 blocker.** |
| `robots.txt` exists | ⚠️ Minimal | `static/robots.txt` is 3 lines: `User-agent: * / Disallow:`. No AI bot entries, no sitemap reference. |
| `sitemap.xml` | ❌ Missing | None at root, none referenced from `robots.txt`. |
| Canonical URL | ❌ Missing | No `<link rel="canonical">` anywhere. |
| Trailing slash / host policy | ⚠️ Undecided | Vercel default: apex serves. Will pick apex `https://wenfang.dev` (no `www`), no trailing slash for `/`. |
| HTTPS | ✅ Assumed | Vercel default. |
| HTTP/2 | ✅ Assumed | Vercel default. |
| Redirect chains | ✅ N/A | Single page, no internal redirects. |

## 1.2 On-page basics — single page `/`

| Element | Current state | Issue |
|---|---|---|
| `<title>` | `Wen \| AI-Native Software Engineer` (62 chars) | 2 chars over 60 budget. Minor. |
| `<meta name="description">` | `Full-Stack Developer building production systems with AI-assisted workflows.` (77 chars) | OK length. No mention of location, name, or recruiter signal. |
| `<h1>` | Single H1, two spans (`Engineering with AI.` + `Shipping with Precision.`) | ✅ Exactly one H1. Good. |
| Heading hierarchy | H1 → section H2s in `AIWorkflow` / `ProjectGrid` / `Experience` | Need to spot-check; will verify in Phase 2 if any skip. |
| Open Graph tags | ❌ None | Missing `og:title`, `og:description`, `og:type`, `og:url`, `og:image`. |
| Twitter Card | ❌ None | Missing `twitter:card`, etc. |
| `<html lang>` | ✅ `en` | Set in `src/app.html`. |
| Author meta | ❌ None | Missing `<meta name="author">`. Cheap GEO signal for recruiters. |

## 1.3 Schema markup

**Current**: zero JSON-LD anywhere in source. Highest-leverage gap in this audit.

**Recommended for this site** (single-page reality — no blog, no project subpages):

- `WebSite` — homepage entity, no `SearchAction` (no site search).
- `Person` — Wen Fang with `jobTitle`, `address`, `knowsAbout`, full `sameAs` array (GitHub + LinkedIn + X). This is the **single most important schema** for a personal site: it lets AI engines do entity resolution back to your real identity across the web.
- `ProfilePage` — wrapper saying "the page at `/` is the profile page of this Person". Useful because the homepage IS the about page on a single-page site.
- `ItemList` of `CreativeWork` for projects — turns `ProjectGrid` into a machine-readable list with name, description, URL, programming languages. Each project = one `CreativeWork`/`SoftwareApplication`.

**Pattern**: a single `@graph` block in `<svelte:head>` with all entities linked by `@id`. Cleaner than scattering blocks.

**Schemas explicitly NOT recommended** (anti-pattern per `seo.md`):
- ❌ `FAQPage` — only add if we also add a real, visible FAQ section. Don't fake.
- ❌ `BlogPosting` / `Article` — no blog posts exist.
- ❌ `Review` / `AggregateRating` — no reviews exist.
- ❌ `BreadcrumbList` — single page, no breadcrumbs.

## 1.4 Content structure (AEO layer)

**Current first-paragraph test** (does the page answer "who is this?" in first 100 words?):

> "Engineering with AI. Shipping with Precision. Building production systems with AI-assisted workflows. The right tool for each phase. Human judgment at every checkpoint."

**Verdict**: Strong brand voice but **missing entity anchors**. A recruiter (or an AI summarizing this page for a recruiter) cannot extract from these 28 words:
- Who? (no name)
- Where? (no city)
- What role exactly? (no "Fullstack Developer" or "AI Engineer")
- How to contact? (no email/CTA in hero)

This is the single biggest AEO/GEO gap. AI engines extract entities from the first content block; we currently give them poetic copy with zero hooks.

**Section H2s** (from grep):
- `#ai-workflow` — "AI Workflow"
- `#projects` — "Projects"
- `#experience` — "Experience"
- `#contact` — footer

**Verdict**: Descriptive enough. Headings are fine. ✅

**FAQ blocks**: none. **Recommendation in Phase 5**: add a small 3–4 question FAQ section (e.g. "What does Wen build?", "Where is Wen based?", "How can I contact Wen?", "What is Wen's tech stack?") — marked up with `FAQPage` schema. High GEO value for recruiter queries, and the answers exist in `portfolio-content.ts` already.

**RAG chatbot content** (`src/lib/data/portfolio-content.ts`): rich, well-structured, but **invisible to crawlers** — it only feeds the chat widget via Supabase. AI search engines do not call our `/api/chat` endpoint. This content needs to be surfaced as visible page text (FAQ, About section, expanded project descriptions) to count for GEO. Worth flagging — but **out of scope for this audit cycle** unless you want me to expand the visible copy in Phase 5.

## 1.5 Performance baseline

Not measured (no local Lighthouse in this sandbox). Observable risks:

| Risk | Severity | Notes |
|---|---|---|
| Google Fonts loaded via `<link>` from `fonts.googleapis.com` | ⚠️ Low-medium | Render-blocking. Already `preconnect`-ed, which is correct. Could self-host or use `font-display: swap` query param. Defer unless Lighthouse fails. |
| No `og:image` | n/a perf | Becomes a Phase 2 deliverable. |
| Image sizes | ⚠️ Unknown | Only `projects/omabite.png` referenced. Will check dimensions during Phase 2. |
| `loading="lazy"` on images | ⚠️ Unknown | Will audit during Phase 2. |
| CLS from missing img dimensions | ⚠️ Unknown | Will audit during Phase 2. |

I will not chase performance in this audit. If `npm run build` finishes clean, baseline is assumed acceptable. You should run a Lighthouse check in Chrome DevTools yourself for ground truth.

## 1.6 AI visibility baseline

Per `seo.md`: don't run these queries from inside the agent. Below is the slot for you to fill in **before** any changes ship, then again ~2 weeks **after** Phase 3 ships.

**Proposed target queries** (recruiter-leaning, since recruiters are primary):

| # | Query | Why this query |
|---|---|---|
| 1 | `AI-native fullstack developer Phoenix` | Local recruiter geo-query, exact role match |
| 2 | `Wen Fang developer` | Branded query — must be #1 result. Tests `Person` schema + `sameAs` resolution |
| 3 | `who is the developer behind wenfang.dev` | Tests AI engines' entity extraction from homepage |
| 4 | `AI-assisted development workflow example portfolio` | Differentiator — your AI workflow page should be cited |
| 5 | `SvelteKit RAG chatbot portfolio example` | Technical peer-discovery query, links you to the project itself |

Test in: ChatGPT (with web search on), Perplexity, Google AI Overviews, Gemini. Record `cited / mentioned / absent` for each. Leave this table empty for now; I'll lift it into `OPTIMIZATION_REPORT.md` at Phase 7.

| Query | ChatGPT before | ChatGPT after | Perplexity before | Perplexity after | Google AIO before | Google AIO after |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |

---

## Prioritized action list (proposal for Phases 2–6)

Ordered by GEO/SEO leverage, not implementation cost. P1 = ship first.

| Priority | Item | Phase | Effort | Why |
|---|---|---|---|---|
| **P1** | `Person` JSON-LD with full `sameAs` | 3 | XS | The single highest-leverage GEO move for a personal site. Cross-references your identity to GitHub/LinkedIn/X so AI engines stop guessing. |
| **P1** | `WebSite` + `ProfilePage` JSON-LD | 3 | XS | Anchors the page-to-entity mapping. |
| **P1** | OG + Twitter tags + canonical | 2 | XS | Required for any social citation, including AI engines that fetch OG data. |
| **P1** | `sitemap.xml` + updated `robots.txt` | 2 | XS | Standard table stakes. |
| **P1** | Add name + location + role to hero or sub-hero copy | 5 | S | The biggest AEO gap. Currently zero entity hooks in first 100 words. |
| **P2** | `ItemList` schema for projects | 3 | S | Makes project section machine-readable. Moderate GEO value. |
| **P2** | Visible FAQ section + `FAQPage` schema | 5 | S | Recruiter queries map directly to FAQ answers. Content already exists in RAG data. |
| **P2** | `llms.txt` curated | 4 | XS | Low-cost insurance. Google says they ignore it; Perplexity/others may not. |
| **P3** | Author meta + Article-ish enrichments | 2 | XS | Marginal but free. |
| **P3** | Centralize `<head>` in a `SiteHead.svelte` component | 2 | S | Keeps per-page meta consistent if we ever add routes. |
| **P3** | Generate a real `og:image` (1200×630) | 2 | S | Phase 2 ships a temporary placeholder; you replace later. |
| **Out of scope** | Expand visible copy from RAG content to count for GEO | — | M | Major content rewrite. Flag for separate decision after this pass ships. |
| **Out of scope** | Performance pass (font self-host, image audit) | — | S | Only if Lighthouse flags a real regression. |

---

## What I will NOT do without your approval

Per `seo.md` anti-patterns:

- No fake `FAQPage` / `Review` schema
- No keyword stuffing
- No copy rewrite beyond what's approved in Phase 5
- No adding npm dependencies for SEO tooling (everything above is plain HTML / JSON / TS)
- No blocking any AI crawlers

---

## 🛑 CHECKPOINT — Approval needed

Before I proceed to Phase 2, please confirm or adjust:

1. **Priority list above** — okay as-is? Want anything reordered or dropped?
2. **Target queries** (section 1.6) — these reflect "recruiter-primary". Want to swap any?
3. **Visible-copy expansion from RAG data** (the "out of scope" item) — interesting to you, or leave it?
4. **OG image** — okay if Phase 2 generates a simple text-based placeholder (your name + role on a brand-color background, SVG-rendered at build time), to be replaced by you later with a designed one?
5. **Host choice** — apex `https://wenfang.dev` (no `www`, no trailing slash on `/`) — confirm.

Once you reply with adjustments or "go", I'll start Phase 2.
