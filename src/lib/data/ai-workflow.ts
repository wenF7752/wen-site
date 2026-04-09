export interface AISkillCard {
	name: string;
	role: string;
	details: string[];
	category: 'orchestration' | 'engineering' | 'quality';
}

export interface WorkflowStep {
	phase: string;
	description: string;
	skills: string[];
	detail: string;
}

export const aiSkills: AISkillCard[] = [
	{
		name: 'Agent Orchestration',
		role: 'Coordinating multi-agent systems, delegating tasks, and synthesizing results across parallel AI workflows',
		details: [
			'Multi-agent pipeline design and coordination',
			'Task decomposition and parallel delegation',
			'Agent memory, tool-use, and context management'
		],
		category: 'orchestration'
	},
	{
		name: 'Context Engineering',
		role: 'Structuring environment, data, and interaction flows so AI systems produce reliable, grounded outputs',
		details: [
			'System prompt architecture and optimization',
			'RAG pipeline design with vector retrieval',
			'MCP integration for external data sources'
		],
		category: 'engineering'
	},
	{
		name: 'AI-Assisted Architecture',
		role: 'Using AI as a thinking partner for system design, tradeoff analysis, and large-scale refactoring',
		details: [
			'AI-driven system design and planning',
			'Codebase-wide refactors with full context',
			'Automated scaffolding and boilerplate generation'
		],
		category: 'engineering'
	},
	{
		name: 'Harness Engineering',
		role: 'Building the runtime layer around AI agents: hooks, evaluation, safety controls, and CI/CD integration',
		details: [
			'Pre/post-action hooks and quality gates',
			'AI-driven code review and PR analysis',
			'Automated testing, linting, and deployment pipelines'
		],
		category: 'quality'
	},
	{
		name: 'Prompt Engineering',
		role: 'Designing and iterating on prompts for complex multi-step workflows with measurable quality benchmarks',
		details: [
			'Chain-of-thought and few-shot prompt design',
			'Prompt evaluation and regression testing',
			'Domain-specific prompt libraries and templates'
		],
		category: 'engineering'
	},
	{
		name: 'Agentic Workflow Design',
		role: 'Designing end-to-end development workflows where AI handles execution and humans own decisions',
		details: [
			'Research-plan-execute development cycles',
			'Delegate-review-own operating models',
			'Critical evaluation of AI-generated output'
		],
		category: 'orchestration'
	}
];

export const workflowSteps: WorkflowStep[] = [
	{
		phase: 'Architect',
		description: 'AI-assisted system design and planning',
		skills: ['Context Engineering', 'Architecture'],
		detail:
			'Explore tradeoffs, generate architecture plans, and reason about system design with AI as a thinking partner before writing code.'
	},
	{
		phase: 'Build',
		description: 'Agent-orchestrated implementation',
		skills: ['Agent Orchestration', 'Prompt Engineering'],
		detail:
			'Decompose features into agent-ready tasks, delegate to parallel AI workflows, and synthesize results with human oversight at every merge point.'
	},
	{
		phase: 'Validate',
		description: 'Automated quality and critical review',
		skills: ['Harness Engineering', 'Code Review'],
		detail:
			'AI-powered PR review, automated lint and type-check hooks, regression testing pipelines. Final judgment is always human.'
	},
	{
		phase: 'Ship',
		description: 'CI/CD with AI-driven confidence',
		skills: ['CI/CD Automation', 'Quality Gates'],
		detail:
			'Automated build verification, static analysis gates, and deployment pipelines with AI-assisted monitoring and rollback.'
	}
];
