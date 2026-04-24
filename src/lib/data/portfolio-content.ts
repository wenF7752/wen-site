/**
 * Portfolio knowledge base for RAG chatbot.
 * Each entry becomes one or more chunks in the vector store.
 * Update this file when your experience or projects change, then re-run the ingest script.
 */

import type { ContentCategory } from '../types/chat.js';

export interface ContentChunk {
	text: string;
	metadata: {
		source: string;
		category: ContentCategory;
	};
}

export const portfolioContent: ContentChunk[] = [
	// --- Background ---
	{
		text: `Wen is a Full-Stack Developer specializing in AI-native development workflows. He builds production systems using AI-assisted architecture, agent orchestration, and modern web technologies. His approach combines deep technical skill with deliberate AI integration, where human judgment drives every decision.`,
		metadata: { source: 'background', category: 'background' }
	},
	{
		text: `Wen's technical stack includes SvelteKit, TypeScript, Node.js, Tailwind CSS, and PostgreSQL for full-stack development. He uses Svelte 5 with the runes API exclusively and follows strict type-safety practices with TypeScript in strict mode.`,
		metadata: { source: 'background', category: 'skills' }
	},

	// --- AI Workflow ---
	{
		text: `Wen's AI workflow follows a four-phase pipeline: Architect, Build, Validate, and Ship. In the Architect phase, he uses AI as a thinking partner for system design, tradeoff analysis, and architecture planning. Context engineering and structured prompts ensure the AI produces grounded, useful output.`,
		metadata: { source: 'workflow', category: 'workflow' }
	},
	{
		text: `In the Build phase, Wen uses agent orchestration to decompose features into parallel AI-ready tasks. Multiple coding agents work simultaneously while he reviews and synthesizes their output. Human oversight is maintained at every merge point.`,
		metadata: { source: 'workflow', category: 'workflow' }
	},
	{
		text: `The Validate phase combines AI-powered code review with automated quality gates. Harness engineering provides pre and post-action hooks that catch lint errors, type issues, and regressions automatically. AI reviews complex pull requests, but final judgment is always human.`,
		metadata: { source: 'workflow', category: 'workflow' }
	},
	{
		text: `In the Ship phase, CI/CD pipelines with AI-driven quality gates ensure production confidence. Automated build verification, static analysis, and deployment pipelines catch issues before they reach production. AI-assisted monitoring helps detect anomalies early.`,
		metadata: { source: 'workflow', category: 'workflow' }
	},

	// --- AI Skills ---
	{
		text: `Wen's core AI engineering skills include: Agent Orchestration (coordinating multi-agent systems, task decomposition, parallel delegation), Context Engineering (system prompt architecture, RAG pipeline design, MCP integration), and AI-Assisted Architecture (AI-driven system design, codebase-wide refactors, automated scaffolding).`,
		metadata: { source: 'skills', category: 'skills' }
	},
	{
		text: `Wen is skilled in Harness Engineering (building runtime layers around AI agents with hooks, evaluation mechanisms, safety controls, and CI/CD integration), Prompt Engineering (chain-of-thought and few-shot prompt design, evaluation, regression testing, domain-specific prompt libraries), and Agentic Workflow Design (research-plan-execute development cycles, delegate-review-own operating models).`,
		metadata: { source: 'skills', category: 'skills' }
	},
	{
		text: `Wen practices critical evaluation of AI-generated output. He believes in using AI to amplify engineering judgment, not replace it. Every AI suggestion is validated against requirements, tested for edge cases, and reviewed for security implications before acceptance.`,
		metadata: { source: 'philosophy', category: 'philosophy' }
	},

	// --- Projects ---
	{
		text: `Wen's AI-Native Portfolio site is a meta-demonstration of his AI workflow. The entire site was built using AI-assisted development: architecture planned by coding agents, implemented with AI-augmented editors, and validated through automated hooks. It uses SvelteKit 2, Svelte 5 (runes API exclusively), TypeScript in strict mode, and Tailwind CSS v4. Deployed to Vercel with Node.js 22.`,
		metadata: { source: 'projects', category: 'projects' }
	},
	{
		text: `The portfolio features a RAG-powered chatbot that demonstrates Retrieval-Augmented Generation in production. It uses Supabase pgvector for semantic search, OpenAI text-embedding-3-small for vectorization (1536-dimensional embeddings), and Moonshot Kimi (kimi-k2-turbo-preview) via an OpenAI-compatible API for response generation. Visitors can ask questions about Wen's experience and get grounded, accurate answers.`,
		metadata: { source: 'projects', category: 'projects' }
	},

	// --- Technical Architecture: RAG Pipeline ---
	{
		text: `The RAG pipeline follows a precise flow: user message arrives via POST /api/chat, the server extracts the latest user message, enforces rate limiting (10 requests per minute per IP), validates message length (500 chars max) and conversation length (10 messages max). The query is then embedded using OpenAI text-embedding-3-small, and the embedding is used to search Supabase pgvector via a match_documents RPC function using cosine similarity.`,
		metadata: { source: 'architecture', category: 'projects' }
	},
	{
		text: `The agentic routing system classifies every incoming query into one of three paths before deciding how to respond. Path A handles greetings (detected via regex pattern matching for hi, hello, hey, etc.) and returns a canned welcome message with suggested follow-up questions, with no LLM call or embedding needed. Path B handles low-confidence queries where the top retrieval similarity score is below 0.25, returning a polite decline with dynamically generated follow-up suggestions, again with no LLM call. Path C handles medium and high confidence queries (similarity >= 0.25) by streaming an LLM response with full RAG context.`,
		metadata: { source: 'architecture', category: 'projects' }
	},
	{
		text: `Confidence scoring is computed from the top similarity score returned by pgvector cosine search. A score of 0.45 or higher maps to high confidence, 0.25 to 0.45 maps to medium confidence, and below 0.25 maps to low confidence. This three-tier system prevents the LLM from hallucinating on off-topic questions (low confidence gets declined) while still providing helpful answers when context is available. Each response carries metadata including the confidence level, source categories, and optional suggested follow-up questions.`,
		metadata: { source: 'architecture', category: 'projects' }
	},
	{
		text: `The chat API uses the Vercel AI SDK's manual stream control via createUIMessageStream and createUIMessageStreamResponse. For greeting and low-confidence paths, the server constructs stream chunks manually (start, text-start, text-delta, text-end, finish) with message metadata attached. For LLM paths, it writes a start chunk with metadata, merges the streamText result (with sendStart and sendFinish disabled), waits for the LLM stream to complete, then writes its own finish chunk with metadata. This gives full control over what metadata reaches the client.`,
		metadata: { source: 'architecture', category: 'projects' }
	},

	// --- Technical Architecture: Database ---
	{
		text: `The database layer uses Supabase with the pgvector extension. A single documents table stores id (bigserial), content (text), metadata (jsonb with category and source fields), embedding (vector with 1536 dimensions matching OpenAI text-embedding-3-small output), and created_at (timestamptz). An IVFFlat index with 100 lists on the embedding column using cosine_ops enables fast approximate nearest neighbor search. A match_documents RPC function performs the similarity search with configurable threshold and result count.`,
		metadata: { source: 'architecture', category: 'projects' }
	},
	{
		text: `The content ingestion pipeline is a standalone CLI script (scripts/ingest.ts) that runs outside SvelteKit using dotenv for environment variables. It reads curated content chunks from portfolio-content.ts, clears existing documents from Supabase, batch-embeds all chunk texts via the OpenAI embeddings API, then bulk-inserts rows with content, metadata, and embeddings. Content chunks are manually curated rather than auto-chunked, with each chunk focused on a single topic for optimal retrieval precision.`,
		metadata: { source: 'architecture', category: 'projects' }
	},

	// --- Engineering Approach ---
	{
		text: `Wen's engineering approach for this project follows a strict research-plan-execute workflow. Every non-trivial feature starts with a research phase where findings are written to research/ markdown files. Then a detailed plan is written in plans/ with restated problem, assumptions, constraints, files affected, data flow model, and verification strategy. Only after the plan is reviewed and approved does implementation begin, executed mechanically with each task checked off as completed.`,
		metadata: { source: 'engineering', category: 'workflow' }
	},
	{
		text: `The project uses harness engineering to maintain code quality during AI-assisted development. A PostToolUse hook runs ESLint automatically on every file edit (TypeScript, JavaScript, and Svelte files), catching lint errors immediately. The CLAUDE.md file encodes project conventions, hard rules, and learned rules that accumulate over sessions. When a mistake happens, the root cause is identified, a fix is encoded as a rule in CLAUDE.md, and the change is logged to a harness changelog. This creates a feedback loop that prevents the same mistakes from recurring.`,
		metadata: { source: 'engineering', category: 'workflow' }
	},
	{
		text: `Context engineering is central to how Wen builds with AI. The CLAUDE.md file serves as a structured context document that includes project overview, architecture, conventions, environment variables, file structure, known gotchas, and hard rules. This ensures every AI coding session starts with accurate, comprehensive context about the codebase. The file is maintained as living documentation that evolves with the project rather than a static reference.`,
		metadata: { source: 'engineering', category: 'skills' }
	},
	{
		text: `The portfolio chatbot's client-side implementation uses Svelte 5 runes exclusively with the Vercel AI SDK's Chat class. The Chat is typed with a generic UIMessage parameterized by ChatMessageMetadata (containing confidence level, source categories, and suggested follow-ups). A Zod schema validates incoming metadata. The UI renders confidence badges (color-coded green/yellow/red), clickable source chips that scroll to relevant page sections, and follow-up suggestion buttons. A thinking indicator shows labeled states ("Analyzing query..." then "Generating response...") derived from the chat status.`,
		metadata: { source: 'engineering', category: 'projects' }
	},

	// --- Philosophy ---
	{
		text: `Wen's development philosophy is rooted in "tacit knowledge" inspired by Michael Polanyi: skill is demonstrated through the artifact, not by listing credentials. His portfolio site itself is the proof of his capabilities. The code quality, design decisions, and technical choices all reflect engineering maturity.`,
		metadata: { source: 'philosophy', category: 'philosophy' }
	},
	{
		text: `Wen follows a research-first, plan-in-markdown, execute-mechanically workflow. For non-trivial tasks, he writes findings to research files, creates detailed plans with assumptions, constraints, and verification strategies, then implements mechanically while marking progress. If an approach fails, he reverts and re-plans rather than patching.`,
		metadata: { source: 'philosophy', category: 'philosophy' }
	},

	// --- Current Role (resume-derived, employer name intentionally omitted) ---
	{
		text: `Wen is currently a Full-Stack Developer at an education technology company in Phoenix, Arizona, from 2023 to present. He has 3+ years shipping production web apps and works at the frontier of AI-assisted development, getting real leverage out of LLMs in daily engineering by designing workflows, writing precise specs, and orchestrating agents to ship features faster without sacrificing quality.`,
		metadata: { source: 'current-role', category: 'experience' }
	},
	{
		text: `In his current Full-Stack Developer role, Wen architects AI-assisted development harnesses, custom agent profiles, MCP tool integrations, and phase-gated workflows that keep LLM output tightly aligned with requirements instead of drifting into confident hallucination. He turns vague product asks into typed specs and testable contracts before code gets written, through deliberate context engineering. The result is fewer iterations, cleaner pull requests, and predictable delivery.`,
		metadata: { source: 'current-role-workflow', category: 'experience' }
	},
	{
		text: `Wen ships LLM-powered product features end-to-end: custom chatbots, RAG pipelines over domain data, streaming UX with completion-vs-truncation protocols, and output-contract validation that surfaces drift as warnings rather than silent corrections. He maintains a cross-session knowledge base that feeds agents hard-won debugging patterns (streaming protocols, effect races, LLM output validation, cache invariants), so AI tools learn from past mistakes instead of re-solving them.`,
		metadata: { source: 'current-role-llm-features', category: 'experience' }
	},
	{
		text: `Wen builds SvelteKit applications end-to-end for thousands of students: Svelte 5 rune state models, server-side rendering, Azure AD JWT + LDAP authentication, accessible mobile-first UI, MSSQL stored procedures behind pooled connection wrappers, and Docker + Azure Pipelines CI/CD across dev, QA, and prod environments. He is the go-to teammate for AI tooling adoption and for debugging non-obvious concurrency, streaming, and LLM-boundary failures.`,
		metadata: { source: 'current-role-sveltekit', category: 'experience' }
	},

	// --- Prior Roles (resume-derived, company names intentionally omitted) ---
	{
		text: `Before his current role, Wen worked as a Full-Stack Developer from 2022 to 2023 on a production NFT marketplace built with Next.js, React, and Node.js. He owned the stack from API design to frontend rendering strategy, supported a live launch event with hundreds of concurrent users competing for a timed NFT drop, and cut perceived page load times by around 40% through static site generation on hot paths, dynamic route restructuring, and hover-triggered data pre-fetch. Earlier, from 2017 to 2018, he worked as a Frontend Web Developer and shipped a Request a Quote flow (JavaScript, Node.js with Express, SMTP) that doubled lead generation.`,
		metadata: { source: 'prior-roles', category: 'experience' }
	},

	// --- Resume Tech Stack Summary ---
	{
		text: `Wen's production stack includes TypeScript, JavaScript, Python, Java, C++, C#, and Bash for languages; React, Svelte and SvelteKit, Node.js, Express, and NestJS for application frameworks; and PostgreSQL, MySQL, and MongoDB for data. His infrastructure toolkit includes Docker, CI/CD pipelines, AWS, Azure DevOps, Vercel, Supabase, Nomad, and Git. For AI-assisted development he uses Claude Code, Codex, Cursor, Lovable, and Bolt, together with spec-first development, AI-assisted TDD, Agile and Scrum practice, and Retrieval-Augmented Generation patterns.`,
		metadata: { source: 'resume-tech-stack', category: 'skills' }
	},

	// --- Education (school name intentionally omitted) ---
	{
		text: `Wen holds a Bachelor's degree in Computer Science, studying from 2018 to 2023 in Tempe, Arizona. His coursework covered data structures, algorithms, web development, and database management.`,
		metadata: { source: 'education', category: 'background' }
	},

	// --- Contact ---
	{
		text: `Wen can be reached by email at me@wenfang.dev. His personal site is wenfang.dev, and his public code lives at github.com/wenF7752.`,
		metadata: { source: 'contact', category: 'background' }
	}
];
