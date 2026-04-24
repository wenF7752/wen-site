/**
 * Source of truth for the "Experience" homepage section.
 * Only the current role is rendered; company name is intentionally omitted.
 */

export interface LatestRole {
	title: string;
	period: string;
	location: string;
	bullets: string[];
}

export const latestRole: LatestRole = {
	title: 'Full-Stack Developer',
	period: '2023–Present',
	location: 'Phoenix, Arizona',
	bullets: [
		'Architect AI-assisted development harnesses, custom agent profiles, MCP tool integrations, and phase-gated workflows that keep LLM output aligned with requirements instead of drifting into confident hallucination.',
		'Turn vague product asks into typed specs and testable contracts before code gets written. Result: fewer iterations, cleaner PRs, predictable delivery.',
		'Maintain a cross-session knowledge base that feeds agents hard-won debugging patterns (streaming protocols, effect races, LLM output validation, cache invariants), so AI tools learn from past mistakes instead of re-solving them.',
		'Ship LLM-powered product features end-to-end: custom chatbots, RAG pipelines over domain data, streaming UX with completion-vs-truncation protocols, and output-contract validation that surfaces drift as warnings rather than silent corrections.',
		'Build SvelteKit apps end-to-end for thousands of students: Svelte 5 rune state models, SSR, Azure AD JWT + LDAP auth, accessible mobile-first UI, MSSQL stored procedures behind pooled connection wrappers, Docker + Azure Pipelines CI/CD across dev, QA, and prod.',
		'Go-to teammate for AI tooling adoption and for debugging non-obvious concurrency, streaming, and LLM-boundary failures.'
	]
};
