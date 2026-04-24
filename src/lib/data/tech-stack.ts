/**
 * Grouped technology list surfaced in the AIWorkflow section.
 * Cleaned of ATS keyword-stuffing noise from the source resume.
 */

export interface TechGroup {
	label: string;
	items: string[];
}

export const techGroups: readonly TechGroup[] = [
	{
		label: 'Stack',
		items: [
			'TypeScript',
			'JavaScript',
			'Python',
			'Java',
			'C++',
			'C#',
			'Bash',
			'React',
			'Svelte / SvelteKit',
			'Node.js',
			'Express',
			'NestJS',
			'PostgreSQL',
			'MySQL',
			'MongoDB'
		]
	},
	{
		label: 'Infra',
		items: ['Docker', 'CI/CD', 'AWS', 'Azure DevOps', 'Vercel', 'Supabase', 'Nomad', 'Git']
	},
	{
		label: 'AI',
		items: [
			'Claude Code',
			'Codex',
			'Cursor',
			'Lovable',
			'Bolt',
			'Spec-first development',
			'AI-assisted TDD',
			'Agile / Scrum',
			'RAG'
		]
	}
];
