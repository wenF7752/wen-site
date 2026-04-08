# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

Static portfolio site for Wen (Senior Software Engineer & Trader). Built with **SvelteKit 2.50.1**, **Svelte 5.48.2** (runes API), **TypeScript 5.9.3** (strict mode), and **Tailwind CSS v4.1.18**. Compiled to static HTML via `@sveltejs/adapter-static`. No backend, no database, no API routes. Node 22 required (enforced via `.nvmrc` + `engine-strict=true` in `.npmrc`).

## Common Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build (static HTML output) |
| `npm run preview` | Serve the production build locally |
| `npm run check` | Run `svelte-kit sync` then `svelte-check` (type checking) |
| `npm run check:watch` | Same as check but in watch mode |

No linter (ESLint/Prettier), no test runner, no git hooks, no CI pipeline configured.

## Architecture

### Svelte 5 Runes (NOT Svelte 4 syntax)

This project uses Svelte 5's runes API exclusively. Do not use Svelte 4 reactive syntax.

| Pattern | Correct (Svelte 5) | Wrong (Svelte 4) |
|---|---|---|
| Reactive state | `let x = $state(false)` | `let x = false` with `$:` |
| Props | `let { foo } = $props()` | `export let foo` |
| Children | `children: Snippet` + `{@render children()}` | `<slot />` |
| Derived | `let y = $derived(x + 1)` | `$: y = x + 1` |

Reference: every component in `src/lib/components/` uses this pattern.

### Import Paths

Use SvelteKit's `$lib` alias for all imports from `src/lib/`. Never use relative paths that escape the current directory (no `../../`).

```ts
// Correct
import Button from '$lib/components/ui/Button.svelte';
import { projects } from '$lib/data/projects';
import type { Project } from '$lib/data/projects';

// Wrong
import Button from '../../components/ui/Button.svelte';
```

Within the same directory (e.g., `ui/`), relative imports like `'./Card.svelte'` are fine.

### Component Organization

```
src/lib/components/
  sections/    Page-level sections (Navbar, Hero, ProjectGrid, Skills, Footer)
  ui/          Reusable primitives (Button, Card, ProjectCard)
```

- **Sections** are composed into pages in `src/routes/+page.svelte`
- **UI components** are used by sections
- All components use PascalCase file names

### Props Pattern

Every component defines a `Props` interface, destructures with `$props()`, and uses `Snippet` for children:

```svelte
<script lang="ts">
    import { type Snippet } from 'svelte';

    interface Props {
        variant?: 'primary' | 'outline';
        children: Snippet;
        [key: string]: any;  // rest props for HTML attributes
    }

    let { variant = 'primary', children, ...rest }: Props = $props();
</script>
```

Reference: `src/lib/components/ui/Button.svelte`

### Data Layer

Static data lives in `src/lib/data/` as typed const arrays with exported interfaces:

- `projects.ts` - `Project` interface (title, description, link, tags)
- `skills.ts` - `Skill` interface (name, level union type, category union type)

### Styling

**Tailwind CSS v4** with a CSS-first configuration approach. The theme is defined in two places (this is a gotcha):

1. **`src/app.css`** - `@theme` block defines CSS custom properties (this is the v4 way)
2. **`tailwind.config.ts`** - JS config duplicates the same theme values (v3 compat)

Both files define identical colors and fonts. If you change theme values, update both files.

**Design tokens:**
- Brand primary: `brand-primary` (#047857, deep emerald)
- Brand accent: `brand-accent` (#2563EB, electric blue)
- Surface palette: `surface-50` through `surface-950` (slate grayscale)
- Fonts: Inter (sans), JetBrains Mono (mono)

**Component classes** are defined in `app.css` `@layer components`:
- `.glass-nav` - Sticky navbar with backdrop blur
- `.btn` / `.btn-primary` / `.btn-secondary` / `.btn-outline` - Button variants
- `.card` - Card with border, rounded corners, hover shadow

**Base layer** in `app.css` sets body styles and responsive heading sizes (h1: `text-4xl md:text-6xl`).

Do not use hardcoded color values. Always use the `brand-*` or `surface-*` tokens.

### Routing

Single-page site. Only one route exists:

| Route | File | Content |
|---|---|---|
| `/` | `src/routes/+page.svelte` | Hero + ProjectGrid + Skills |

Layout (`+layout.svelte`) wraps all pages with Navbar and Footer. All pages are prerendered (`export const prerender = true` in `+layout.ts`). The static adapter generates a `404.html` fallback.

### Fonts

Loaded via Google Fonts CDN in `src/app.html`. Two fonts:
- **Inter** (weights 300-800) for body text
- **JetBrains Mono** (weights 400-700) for monospace

## File & Folder Structure

```
src/
  app.css              Global styles: Tailwind v4 @theme, base layer, component classes
  app.d.ts             SvelteKit type declarations
  app.html             HTML shell (Google Fonts, meta tags, SvelteKit placeholders)
  lib/
    index.ts           Barrel export (currently empty)
    assets/
      favicon.svg      Site favicon
    components/
      sections/        Page sections: Navbar, Hero, ProjectGrid, Skills, Footer
      ui/              Reusable: Button (polymorphic a/button), Card, ProjectCard
    data/
      projects.ts      Project[] with title, description, link, tags
      skills.ts        Skill[] with name, level, category
  routes/
    +layout.svelte     Root layout: Navbar + {children} + Footer
    +layout.ts         Prerender config (prerender = true)
    +page.svelte       Home: Hero, ProjectGrid, Skills sections
static/
  robots.txt           SEO robots file
```

## Hard Rules

- Use Svelte 5 runes only. Never use `export let`, `$:`, or `<slot />`.
- Use `$lib/` alias for cross-directory imports. No deep relative paths.
- Never hardcode color values. Use `brand-*` and `surface-*` tokens from the theme.
- When changing theme colors or fonts, update BOTH `src/app.css` (@theme block) AND `tailwind.config.ts`.
- Button variants are defined in `app.css` component layer. New button styles go there, not inline.
- Keep data in `src/lib/data/` with typed interfaces. Components import data, they don't define it inline.
- Static site only. Do not add server-side logic, API routes, or `+page.server.ts` files.

## Learned Rules

