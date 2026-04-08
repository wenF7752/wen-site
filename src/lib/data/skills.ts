export interface Skill {
	name: string;
	level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
	category: 'Frontend' | 'Backend' | 'Tools' | 'Other';
}

export const skills: Skill[] = [
	{ name: 'Svelte', level: 'Expert', category: 'Frontend' },
	{ name: 'TypeScript', level: 'Advanced', category: 'Frontend' },
	{ name: 'Node.js', level: 'Advanced', category: 'Backend' },
	{ name: 'Tailwind CSS', level: 'Intermediate', category: 'Frontend' },
	{ name: 'PostgreSQL', level: 'Intermediate', category: 'Backend' },
	{ name: 'Git', level: 'Advanced', category: 'Tools' }
];
