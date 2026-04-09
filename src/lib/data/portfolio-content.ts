/**
 * Portfolio knowledge base for RAG chatbot.
 * Each entry becomes one or more chunks in the vector store.
 * Update this file when your experience or projects change, then re-run the ingest script.
 */

export interface ContentChunk {
	text: string;
	metadata: {
		source: string;
		category: 'background' | 'skills' | 'workflow' | 'projects' | 'philosophy';
	};
}

export const portfolioContent: ContentChunk[] = [
	// --- Background ---
	{
		text: `Wen is a Senior Software Engineer specializing in AI-native development workflows. He builds production systems using AI-assisted architecture, agent orchestration, and modern web technologies. His approach combines deep technical skill with deliberate AI integration, where human judgment drives every decision.`,
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
		text: `Wen's AI-Native Portfolio site is a meta-demonstration of his AI workflow. The entire site was built using AI-assisted development: architecture planned by coding agents, implemented with AI-augmented editors, and validated through automated hooks. It uses SvelteKit 2, Svelte 5, TypeScript, and Tailwind CSS v4.`,
		metadata: { source: 'projects', category: 'projects' }
	},
	{
		text: `The portfolio features a RAG-powered chatbot that demonstrates Retrieval-Augmented Generation in production. It uses Supabase pgvector for semantic search, OpenAI embeddings for vectorization, and Anthropic Claude for response generation. Visitors can ask questions about Wen's experience and get grounded, accurate answers.`,
		metadata: { source: 'projects', category: 'projects' }
	},

	// --- Philosophy ---
	{
		text: `Wen's development philosophy is rooted in "tacit knowledge" inspired by Michael Polanyi: skill is demonstrated through the artifact, not by listing credentials. His portfolio site itself is the proof of his capabilities. The code quality, design decisions, and technical choices all reflect engineering maturity.`,
		metadata: { source: 'philosophy', category: 'philosophy' }
	},
	{
		text: `Wen follows a research-first, plan-in-markdown, execute-mechanically workflow. For non-trivial tasks, he writes findings to research files, creates detailed plans with assumptions, constraints, and verification strategies, then implements mechanically while marking progress. If an approach fails, he reverts and re-plans rather than patching.`,
		metadata: { source: 'philosophy', category: 'philosophy' }
	}
];
