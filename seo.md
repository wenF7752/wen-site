# GEO / SEO / AEO Optimization — Handoff for Claude Code

## Mission

Optimize this site for visibility across **three discovery channels**:

1. **Traditional SEO** — Google / Bing organic search
2. **AEO** (Answer Engine Optimization) — Featured snippets, voice assistants, direct-answer boxes
3. **GEO** (Generative Engine Optimization) — Citations in ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews

The goal is *citation worthiness*, not keyword stuffing. AI engines synthesize answers from authoritative, well-structured sources — we want this site to be one of them.

---

## How to work through this document

Do **not** start coding immediately. Work in phases, and pause at every `🛑 CHECKPOINT` to ask me a question before continuing. Use TodoWrite to track phases.

Order of operations:

1. **Phase 0 — Discovery**: read the repo, then ask me the context questions.
2. **Phase 1 — Audit**: produce a written audit of the current state. Pause for my review.
3. **Phase 2–6 — Implementation**: execute in priority order. After each phase, summarize what changed.
4. **Phase 7 — Validation**: run all validators and report results.

---

## Phase 0 — Discovery

Before touching anything:

1. **Inspect the repo**. Identify:
   - Framework (Next.js / Astro / SvelteKit / plain HTML / WordPress export / etc.)
   - Rendering strategy (SSR / SSG / CSR — this matters a LOT, see "Anti-patterns" below)
   - Routing structure and which pages exist
   - Existing meta tags, sitemap, robots.txt
   - Any existing schema markup (search for `application/ld+json` or `itemprop`)
   - Build/deploy setup
   - Package manager + Node version

2. **Check rendered output, not just source code.** If this is a CSR app (e.g. plain Vite + React with no SSR), the HTML AI crawlers see is mostly empty. Run a build and curl the rendered HTML to confirm what bots actually receive. If it's empty, flag this as a **P0 blocker** before anything else.

3. 🛑 **CHECKPOINT** — Ask me these questions, then stop and wait:

   - **What is this site about in one sentence?** (Your "entity definition" — this becomes the anchor for everything.)
   - **Who is the target reader?** (Recruiters, potential clients, peers, students, all of the above?)
   - **What 3–5 queries do you most want to be cited for?** (e.g. "Berlin freelance React developer", "how to set up X", "what is Y") — be specific, including city/niche if relevant.
   - **What pages must exist?** (Home, About, Blog index, individual posts, Projects, Contact, etc.) Confirm against what's in the repo.
   - **Real name, location (city + country), professional title, languages spoken, primary contact email/URL, GitHub/LinkedIn/X URLs.** Needed for `Person` schema and `sameAs` cross-references.
   - **Is there an existing brand voice or tone I should preserve in any new copy I write?**
   - **Any pages or sections that should NOT be indexed by search engines or AI?** (Drafts, private notes, client-only pages.)

---

## Phase 1 — Audit (no code changes yet)

Produce `AUDIT.md` in the repo root covering:

### 1.1 Rendering & crawlability
- Is rendered HTML present without JS? (Critical for AI crawlers.)
- Does `robots.txt` exist? Does it block any AI bots inadvertently?
- Is there a `sitemap.xml`? Is it linked from `robots.txt`?
- Canonical URL setup — any duplicates, trailing-slash inconsistencies, www vs apex?
- HTTPS, HTTP/2, redirect chains.

### 1.2 On-page basics
For each indexable page, record:
- `<title>` — present, unique, ≤ 60 chars?
- `<meta name="description">` — present, unique, ≤ 160 chars?
- `<h1>` — exactly one, descriptive?
- Heading hierarchy — H1 → H2 → H3, no skipping?
- Open Graph + Twitter Card tags?
- Language attribute on `<html>`?

### 1.3 Schema markup
- What JSON-LD exists today? Validate against schema.org.
- What types are missing for this site? (See Phase 3.)

### 1.4 Content structure (the AEO/GEO layer)
For each meaningful page:
- Is the main answer in the **first 100 words**? Or buried below the fold?
- Are there clear sub-sections with descriptive H2/H3s?
- Are claims attributable (dates, sources, statistics)?
- Are there FAQ-style Q&A blocks?

### 1.5 Performance baseline
- Run a Lighthouse-style check (or note what's available in the stack). Record LCP, CLS, INP estimates if possible.
- Note image sizes — any unoptimized assets?

### 1.6 AI visibility baseline
- Document a manual baseline: list the 3–5 target queries from Phase 0, and note that I will manually test them in ChatGPT/Perplexity/Gemini *before* changes and again after, so we can compare. (Don't actually run those queries — they're not deterministic and you can't observe them from inside Claude Code anyway. Just leave a section for me to fill in.)

🛑 **CHECKPOINT** — Show me the audit. I'll prioritize. Don't proceed until I approve.

---

## Phase 2 — Technical foundations

Highest priority because everything else depends on this.

### 2.1 robots.txt
Generate or update `robots.txt`. Default policy: **allow all major AI crawlers**, unless I said otherwise in Phase 0.

Crawlers to explicitly allow (default behavior is allow, but listing makes intent clear and protects against accidental blocks downstream):

```
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: *
Allow: /
Disallow: /any/private/paths/from/checkpoint/

Sitemap: https://DOMAIN/sitemap.xml
```

Replace `DOMAIN` with my actual domain (ask if not obvious from repo).

### 2.2 sitemap.xml
- Generate dynamically if the framework supports it (Next.js `app/sitemap.ts`, Astro `@astrojs/sitemap`, etc.).
- Include `lastmod` dates. Stale dates hurt — make them reflect actual content updates.
- Reference from `robots.txt`.

### 2.3 Canonical URLs
- Every page gets a `<link rel="canonical">`.
- Pick a single host (apex or www, http or https) and 301 the others.
- Decide on trailing slash policy and enforce it consistently.

### 2.4 Meta tags per page
For every page, ensure:
- Unique `<title>` (pattern: `Page Topic — Site Name`, ≤ 60 chars)
- Unique `<meta name="description">` (≤ 160 chars, contains the actual answer/value prop, not marketing fluff)
- `<meta property="og:title">`, `og:description`, `og:type`, `og:url`, `og:image`
- `<meta name="twitter:card" content="summary_large_image">` and matching tags
- `<html lang="...">` set

If the framework has a Head component (Next.js Metadata API, Astro `<head>`, etc.), centralize this so it's consistent.

### 2.5 Performance quick wins
- Compress and properly size images. Use modern formats (AVIF/WebP) with fallbacks.
- Lazy-load images below the fold (`loading="lazy"`).
- Width/height on all `<img>` to prevent CLS.
- Preconnect to any critical third-party origins.

---

## Phase 3 — Schema markup (highest leverage for GEO)

This is where GEO is mostly won or lost. **Attribute-rich schema is worth more than no schema; no schema is worth more than wrong/incomplete schema.** Validate everything.

Use **JSON-LD** in `<script type="application/ld+json">`, placed in `<head>`. Do not use microdata or RDFa.

### 3.1 Required on every page

**`WebSite`** — once, on homepage:
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "...",
  "url": "https://DOMAIN",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://DOMAIN/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```
(Omit `potentialAction` if there's no site search.)

**`Person`** or **`Organization`** — once, on homepage and About page. Since this is a personal site, use `Person`:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Real Name",
  "url": "https://DOMAIN",
  "image": "https://DOMAIN/path/to/headshot.jpg",
  "jobTitle": "...",
  "worksFor": { "@type": "Organization", "name": "..." },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "City",
    "addressCountry": "XX"
  },
  "knowsAbout": ["...", "...", "..."],
  "sameAs": [
    "https://github.com/username",
    "https://linkedin.com/in/username",
    "https://x.com/username"
  ]
}
```

`sameAs` is critical — it's how AI engines link this site to my identity across the web (entity resolution). Include every authoritative profile.

### 3.2 Per-page schemas

Map page types to schema types:

| Page type | Schema |
|---|---|
| Blog post / article | `BlogPosting` or `Article` with `author`, `datePublished`, `dateModified`, `headline`, `image`, `mainEntityOfPage`, `wordCount`, `articleSection` |
| Tutorial / how-to | `HowTo` with `step` array |
| FAQ section | `FAQPage` with `mainEntity` Q&A array |
| Project / case study | `CreativeWork` or `SoftwareApplication` |
| Contact page | `ContactPage` |
| About page | reuse `Person` |
| Breadcrumbs (any deep page) | `BreadcrumbList` |

### 3.3 Nesting (the part most sites get wrong)
Don't drop disconnected schema blocks. Nest them. The `Article` on a blog post should reference the `Person` author by `@id`, the `Person` should reference the `WebSite` they publish on, etc. Use `@id` to link entities across the page and the site.

Example pattern:
```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Person", "@id": "https://DOMAIN/#me", "name": "..." },
    { "@type": "WebSite", "@id": "https://DOMAIN/#site", "publisher": { "@id": "https://DOMAIN/#me" } },
    { "@type": "BlogPosting", "@id": "https://DOMAIN/post/x/#article", "author": { "@id": "https://DOMAIN/#me" }, "isPartOf": { "@id": "https://DOMAIN/#site" } }
  ]
}
```

### 3.4 Validation
After generating schema for every page type, run each through:
- https://validator.schema.org/ (manually — note this in the final report)
- https://search.google.com/test/rich-results (manually)

In code, you can lint structure with `schema-dts` (TypeScript types) or `structured-data-testing-tool` (CLI) if added as a dev dep. Don't add heavy deps just for this — a one-time validation run is fine.

---

## Phase 4 — AI-specific files

### 4.1 llms.txt
Create `/llms.txt` at the site root. This is a Markdown-formatted index that AI crawlers may use to understand the site's structure without parsing JS or navigating menus.

**Honest caveat in the file's purpose**: Google has stated they don't use it. Adoption among other engines is mixed. It's low-cost insurance, not a silver bullet. Make it anyway.

Template:
```markdown
# Site Name

> One-to-three sentence summary of who I am, what this site is, and what value it offers. Written as if explaining to someone who's never visited. This summary will likely be what AI uses as its "mental model" of the site.

## About
- [About](https://DOMAIN/about): Bio, background, what I work on.

## Writing
- [Blog](https://DOMAIN/blog): Index of all posts.
- [Post Title 1](https://DOMAIN/blog/post-1): One-sentence description.
- [Post Title 2](https://DOMAIN/blog/post-2): One-sentence description.

## Projects
- [Project A](https://DOMAIN/projects/a): What it is, what stack, what problem it solves.

## Contact
- [Contact](https://DOMAIN/contact): How to reach me.
```

If the site has many blog posts, prioritize — list the strongest 10–20, not every post.

### 4.2 llms-full.txt (optional)
A single concatenated Markdown dump of the most important pages, for AI systems that ingest in one request. Only include public, non-time-sensitive content. Skip if it would be > 500KB.

---

## Phase 5 — Content structure (the AEO layer)

This is content work, not just markup. For each meaningful page (especially blog posts and the About page), restructure to make extraction easy.

### 5.1 Answer-first formatting
- The first paragraph should answer the page's core question. No throat-clearing intros. No "In today's fast-paced world…"
- If the page answers a specific question, state the answer in the first sentence, then explain.

### 5.2 Scannable structure
- Descriptive H2/H3 headings that contain the question/concept, not clever wordplay
- Short paragraphs (2–4 sentences max)
- Bulleted or numbered lists where they fit naturally
- Tables for comparisons
- One idea per section — don't bury secondary topics

### 5.3 Citation-worthiness signals
- Concrete numbers and dates where possible
- Attribute claims to sources with real links
- Author byline and `datePublished` / `dateModified` visible to humans, not just in schema
- Update old posts and bump `dateModified` — freshness matters

### 5.4 FAQ blocks where appropriate
Add a 3–5 question FAQ section at the bottom of cornerstone pages. Mark up with `FAQPage` schema. Questions should be ones a real person would type / ask an AI.

🛑 **CHECKPOINT** — Before rewriting any of my existing content, **show me the diff for one page first**. I want to approve the editorial direction before you touch the rest.

---

## Phase 6 — Internal linking & entity reinforcement

- Every page should link to at least 2 other relevant internal pages with descriptive anchor text (not "click here").
- The homepage should link to all cornerstone pages within 1 click.
- Add a "Related posts" section to blog posts.
- Mention key entities (technologies, places, concepts) by their canonical name consistently across the site. AI engines build entity graphs — consistency reinforces the association.

---

## Phase 7 — Validation & reporting

Run and report on:

1. **HTML validation** — `html-validate` or W3C validator on key pages
2. **Schema validation** — list the URLs to test in validator.schema.org and Google Rich Results Test
3. **robots.txt syntax** — `https://www.google.com/webmasters/tools/robots-testing-tool` (manual)
4. **Sitemap validation** — fetch and verify it's valid XML with reachable URLs
5. **Lighthouse audit** (if available locally via `lighthouse` CLI or Chrome) — report SEO score and Core Web Vitals
6. **Crawlability spot-check** — `curl -A "GPTBot" https://DOMAIN/` and verify meaningful HTML comes back (no JS-only render)
7. **Link check** — confirm no broken internal links

Produce `OPTIMIZATION_REPORT.md` in the repo root summarizing:
- Every file changed (grouped by phase)
- What was added (schema types, meta tags, etc.)
- Validator results
- What I still need to do manually (see "Out of scope" below)
- The 3–5 target queries from Phase 0, with empty "before / after" cells for me to fill in over time

---

## Anti-patterns — do NOT do these

- ❌ **Don't add schema markup that doesn't reflect the actual page content.** Fake `Review`/`AggregateRating` schema, fake `FAQPage` schema where no FAQ is visible to humans — these can trigger manual penalties from Google.
- ❌ **Don't keyword-stuff.** Modern engines, both classic and generative, penalize it.
- ❌ **Don't use `noindex` carelessly.** Audit existing usage; don't add new ones without asking.
- ❌ **Don't hide content from users that's visible to bots, or vice versa** (cloaking).
- ❌ **Don't write content for AI by removing nuance.** "AI-readable" doesn't mean dumbed down — it means well-structured. Boring, robotic prose performs *worse* because it lacks the specificity AI cites.
- ❌ **Don't add 50 npm dependencies for SEO tooling.** Most of this is HTML and JSON. Add deps only if the framework idiomatically expects them.
- ❌ **Don't block AI crawlers thinking it'll "save tokens" or "protect content".** The whole goal is to be cited. If I want specific pages excluded, I told you in Phase 0.
- ❌ **Don't generate `llms.txt` from `sitemap.xml` automatically.** It should be curated and prioritized, not a dump.
- ❌ **Don't touch my existing copy without showing me a diff first** (Phase 5 checkpoint).

---

## Out of scope (I'll do these myself)

These matter for GEO but can't be done from inside the repo — listing so you don't try:

- Manual queries in ChatGPT / Claude / Perplexity / Gemini to measure citation baseline and post-change visibility
- Submitting sitemap to Google Search Console and Bing Webmaster Tools
- Setting up analytics
- Posting/engagement on Reddit, LinkedIn, HN, YouTube — these are heavily cited by AI engines but I have to do that as a human
- Building backlinks / digital PR
- Registering with Wikidata or similar knowledge graphs

Mention these in the final report as next steps.

---

## Definition of done

- [ ] `AUDIT.md` exists and was approved
- [ ] `robots.txt` allows major AI crawlers, references sitemap
- [ ] `sitemap.xml` generated and valid
- [ ] Every page has unique `<title>`, `<meta description>`, canonical URL, OG tags
- [ ] Every page has appropriate JSON-LD schema, nested with `@id` references, validated
- [ ] `llms.txt` exists at site root, curated and current
- [ ] Cornerstone pages restructured for answer-first / scannable format (approved diffs only)
- [ ] Internal linking pass complete
- [ ] All validators run, results in `OPTIMIZATION_REPORT.md`
- [ ] `curl -A "GPTBot" DOMAIN` returns meaningful HTML for all key pages
- [ ] Performance not regressed (Lighthouse before/after if available)

Begin with Phase 0. Inspect the repo, then ask me the checkpoint questions.