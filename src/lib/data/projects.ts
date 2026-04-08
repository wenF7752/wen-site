export interface Project {
	title: string;
	description: string;
	link: string;
	tags: string[];
}

export const projects: Project[] = [
	{
		title: 'OpenClaw',
		description: 'An open-source AI agent platform for personal automation and assistance.',
		link: 'https://github.com/OpenClaw/OpenClaw',
		tags: ['TypeScript', 'Node.js', 'AI']
	},
	{
		title: 'Personal Portfolio',
		description: 'A sleek, responsive portfolio site built with Svelte 5 and Runes.',
		link: '#',
		tags: ['Svelte', 'TypeScript', 'CSS']
	}
];
