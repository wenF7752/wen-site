export interface PhaseTechnique {
	name: string;
	description: string;
	details: string[];
}

export interface PipelinePhase {
	id: string;
	phase: string;
	number: string;
	headline: string;
	description: string;
	narrative: string;
	techniques: PhaseTechnique[];
	color: string;
	rgb: string;
}

export const pipelinePhases: PipelinePhase[] = [
	{
		id: 'architect',
		phase: 'Architect',
		number: '01',
		headline: 'Design with AI as a thinking partner',
		description: 'AI-assisted system design and planning',
		narrative:
			'Before writing code, I set up the harness: CLAUDE.md files encode project conventions and hard rules so every AI session starts with accurate context. System prompts for coding agents are designed to clarify scope, surface tradeoffs, and ask the right questions about feature requirements. Context engineering structures the data and interaction flows so AI produces grounded, reliable architecture decisions.',
		techniques: [
			{
				name: 'Harness Engineering',
				description:
					'Configure the runtime layer around AI agents to iterate efficiently with fewer bugs',
				details: [
					'CLAUDE.md files encoding project conventions and hard rules',
					'PostToolUse hooks for automated lint and type-check on every edit',
					'Harness changelog tracking corrections across sessions'
				]
			},
			{
				name: 'Prompt Engineering',
				description:
					'System prompts for coding agents that refine requirements and clarify scope',
				details: [
					'Workflow instructions: research-plan-execute cycles',
					'Scope clarification prompts that surface edge cases early',
					'Domain-specific prompt libraries for architecture decisions'
				]
			},
			{
				name: 'Context Engineering',
				description:
					'Structure environment and data so AI produces grounded, reliable output',
				details: [
					'RAG pipeline design with vector retrieval for knowledge bases',
					'MCP integration for external data sources and tools',
					'System prompt architecture and optimization'
				]
			}
		],
		color: '#10b981',
		rgb: '16, 185, 129'
	},
	{
		id: 'build',
		phase: 'Build',
		number: '02',
		headline: 'Orchestrate agents, own the decisions',
		description: 'Agent-orchestrated implementation',
		narrative:
			'Features are decomposed into agent-ready tasks. Multiple AI workflows run in parallel -- researching, generating code, writing tests -- while human oversight governs every merge point. The operating model is delegate-review-own: agents execute, the engineer decides. Every piece of AI-generated output gets critical evaluation before it ships.',
		techniques: [
			{
				name: 'Agent Orchestration',
				description:
					'Coordinate multi-agent systems with parallel delegation and task decomposition',
				details: [
					'Multi-agent pipeline design and coordination',
					'Task decomposition into parallel AI-ready work units',
					'Agent memory, tool-use, and context management'
				]
			},
			{
				name: 'Agentic Workflow Design',
				description:
					'End-to-end development workflows where AI handles execution, humans own decisions',
				details: [
					'Research-plan-execute development cycles',
					'Delegate-review-own operating model at every merge point',
					'Critical evaluation of AI-generated output'
				]
			}
		],
		color: '#3b82f6',
		rgb: '59, 130, 246'
	},
	{
		id: 'validate',
		phase: 'Validate',
		number: '03',
		headline: 'Automated quality, human judgment',
		description: 'Automated quality and critical review',
		narrative:
			'Harness engineering wraps every AI action in quality gates. Pre and post-action hooks catch lint errors, type violations, and regressions automatically. AI-powered PR review analyzes complex diffs for logic errors, security issues, and architectural drift. The final approval is always human -- AI surfaces problems, the engineer makes the call.',
		techniques: [
			{
				name: 'Harness Engineering',
				description:
					'Pre/post-action hooks and quality gates that catch issues before they compound',
				details: [
					'Automated lint and type-check on every file edit',
					'Pre-commit hooks enforcing code standards',
					'Regression testing pipelines triggered by AI changes'
				]
			},
			{
				name: 'AI-Assisted Code Review',
				description:
					'AI-powered PR analysis with human final judgment on every approval',
				details: [
					'Complex diff analysis for logic errors and security issues',
					'Architectural drift detection across the codebase',
					'Prompt evaluation and regression testing for AI reliability'
				]
			}
		],
		color: '#f59e0b',
		rgb: '245, 158, 11'
	},
	{
		id: 'ship',
		phase: 'Ship',
		number: '04',
		headline: 'Deploy with AI-driven confidence',
		description: 'CI/CD with AI-driven confidence',
		narrative:
			'CI/CD pipelines integrate AI at every checkpoint. Automated build verification and static analysis gates catch issues before production. AI-assisted monitoring detects anomalies early, and automated rollback procedures provide safety nets. The pipeline is the harness -- the same engineering discipline that shapes AI behavior also shapes deployment.',
		techniques: [
			{
				name: 'CI/CD Automation',
				description:
					'Build verification and deployment pipelines with static analysis gates',
				details: [
					'Automated build verification on every push',
					'Static analysis gates blocking unsafe deployments',
					'Deployment pipelines with staged rollouts'
				]
			},
			{
				name: 'AI Monitoring',
				description:
					'Anomaly detection and automated rollback for production confidence',
				details: [
					'AI-assisted anomaly detection in production metrics',
					'Automated rollback procedures on regression signals',
					'Post-deploy verification and health checks'
				]
			}
		],
		color: '#8b5cf6',
		rgb: '139, 92, 246'
	}
];
