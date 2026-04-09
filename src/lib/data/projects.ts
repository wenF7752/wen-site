export interface Project {
	title: string;
	description: string;
	link: string;
	tags: string[];
	aiHighlight?: string;
	status?: 'live' | 'in-progress' | 'archived';
}

export const projects: Project[] = [
	{
		title: 'AI-Native Portfolio',
		description:
			'This site. Built entirely with AI-assisted workflows to demonstrate modern development practices. Architecture planned by coding agents, implemented with AI-augmented editors.',
		link: '#',
		tags: ['Svelte 5', 'TypeScript', 'Tailwind v4', 'Agentic Workflow'],
		aiHighlight: 'Meta-demonstration: built BY the AI workflow it showcases',
		status: 'live'
	},
	{
		title: 'Coming Soon',
		description:
			'Next AI project in progress. Check back soon for updates on RAG pipelines, agent orchestration, or prompt engineering toolkits.',
		link: '#',
		tags: ['AI', 'In Progress'],
		status: 'in-progress'
	}
];
