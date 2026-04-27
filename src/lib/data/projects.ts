export interface Project {
	title: string;
	description: string;
	link: string;
	liveUrl?: string;
	previewImage?: string;
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
		title: 'Omabite',
		description:
			'A wizard-driven dish picker for UberEats. Five short steps land you on one specific dish at one specific restaurant, with reasoned "why this" and a deep link to order. A single SSE pipeline orchestrates Brave search, Apify menu scraping, and Kimi ranking, then validates the pick against the menu and the user\'s allergens.',
		link: 'https://github.com/wenF7752/Omakai',
		liveUrl: 'https://omabite.food',
		previewImage: '/projects/omabite.png',
		tags: ['Next.js 16', 'React 19', 'TypeScript', 'Zod 4', 'SSE Pipeline'],
		aiHighlight: 'Streamed multi-stage pipeline: search → shortlist → menu → dish pick, with graceful degradation',
		status: 'live'
	}
];
