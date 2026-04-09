export interface Skill {
	name: string;
	level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
	category: 'Frontend' | 'Backend' | 'Tools' | 'AI' | 'Other';
}

export const skills: Skill[] = [
	{ name: 'Agent Orchestration', level: 'Expert', category: 'AI' },
	{ name: 'Context Engineering', level: 'Advanced', category: 'AI' },
	{ name: 'Prompt Engineering', level: 'Advanced', category: 'AI' },
	{ name: 'Harness Engineering', level: 'Advanced', category: 'AI' },
	{ name: 'Agentic Workflow Design', level: 'Advanced', category: 'AI' },
	{ name: 'AI Code Review', level: 'Advanced', category: 'AI' },
	{ name: 'Svelte', level: 'Expert', category: 'Frontend' },
	{ name: 'TypeScript', level: 'Advanced', category: 'Frontend' },
	{ name: 'Node.js', level: 'Advanced', category: 'Backend' },
	{ name: 'Tailwind CSS', level: 'Intermediate', category: 'Frontend' },
	{ name: 'PostgreSQL', level: 'Intermediate', category: 'Backend' },
	{ name: 'Git', level: 'Advanced', category: 'Tools' }
];
