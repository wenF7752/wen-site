# Plan: Add ESLint + Prettier + Post-Edit Hook

## Problem

The project has no linter or formatter. We need ESLint 9 (flat config) with Svelte 5 + TypeScript support, Prettier with Svelte and Tailwind plugins, and a Claude Code PostToolUse hook that runs the linter after every Edit/Write.

## Assumptions & Constraints

- ESLint 9 flat config format (not legacy `.eslintrc`)
- `eslint-plugin-svelte` v3+ for Svelte 5 compatibility
- `prettier-plugin-tailwindcss` must be last in the plugins array
- Tailwind v4 uses CSS-first config, so Prettier plugin needs `tailwindStylesheet` pointing to `src/app.css`
- No test files exist, so no test-specific lint rules needed
- Project uses `"type": "module"` so configs can use ESM

## Files Affected

1. `package.json` - new devDependencies + scripts
2. `eslint.config.js` - new file (flat config)
3. `.prettierrc` - new file
4. `.prettierignore` - new file
5. `.claude/hooks/post-edit-lint.sh` - new file (PostToolUse hook)
6. `.claude/settings.local.json` - new file (hook registration)
7. `CLAUDE.md` - update "Common Commands" and "No linter" note

## Steps

- [x] 1. Install all packages: `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-svelte`, `globals`, `prettier`, `prettier-plugin-svelte`, `prettier-plugin-tailwindcss`
- [x] 2. Create `eslint.config.js` with flat config for TS + Svelte
- [x] 3. Create `.prettierrc` with Svelte + Tailwind plugins
- [x] 4. Create `.prettierignore`
- [x] 5. Add `lint`, `lint:fix`, `format`, `format:check` scripts to `package.json`
- [x] 6. Run `npm run lint` and `npm run format:check` to verify setup works
- [x] 7. Fix any lint/format errors in existing code
- [x] 8. Create `.claude/hooks/post-edit-lint.sh` (PostToolUse lint hook)
- [x] 9. Create `.claude/settings.local.json` with hook registration
- [x] 10. Test the hook
- [x] 11. Update CLAUDE.md

## Verification

- `npm run lint` exits 0
- `npm run format:check` exits 0
- `npm run build` still succeeds
- Hook script returns valid JSON on lint errors, silent on clean files
