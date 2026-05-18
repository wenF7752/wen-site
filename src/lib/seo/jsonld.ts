import { projects, type Project } from '$lib/data/projects'

const SITE = 'https://wenfang.dev'
const PERSON_ID = `${SITE}/#person`
const WEBSITE_ID = `${SITE}/#website`
const PROFILE_ID = `${SITE}/#profile`
const PROJECTS_ID = `${SITE}/#projects`

const APP_CATEGORIES: Record<string, string> = {
	'AI-Native Portfolio': 'DeveloperApplication',
	Omabite: 'LifestyleApplication'
}

function projectToListItem(project: Project, index: number) {
	const isThisSite = project.link === '#' || project.title === 'AI-Native Portfolio'
	const canonicalUrl = isThisSite ? `${SITE}/` : (project.liveUrl ?? project.link)
	const sourceUrl = !isThisSite && project.liveUrl ? project.link : undefined

	return {
		'@type': 'ListItem',
		position: index + 1,
		item: {
			'@type': 'SoftwareApplication',
			name: project.title,
			url: canonicalUrl,
			...(sourceUrl ? { sameAs: sourceUrl } : {}),
			description: project.description,
			applicationCategory: APP_CATEGORIES[project.title] ?? 'WebApplication',
			operatingSystem: 'Web',
			author: { '@id': PERSON_ID },
			keywords: project.tags.join(', ')
		}
	}
}

const graph = {
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'Person',
			'@id': PERSON_ID,
			name: 'Wen Fang',
			givenName: 'Wen',
			familyName: 'Fang',
			url: `${SITE}/`,
			image: `${SITE}/og-image.svg`,
			jobTitle: 'AI-Native Fullstack Developer',
			description:
				'AI-native fullstack developer building production web systems with agentic AI workflows.',
			address: {
				'@type': 'PostalAddress',
				addressLocality: 'Phoenix',
				addressRegion: 'AZ',
				addressCountry: 'US'
			},
			email: 'me@wenfang.dev',
			knowsLanguage: ['en'],
			knowsAbout: [
				'AI-native software development',
				'Agent orchestration',
				'Retrieval-Augmented Generation',
				'Context engineering',
				'Prompt engineering',
				'Harness engineering',
				'SvelteKit',
				'TypeScript',
				'Full-stack web development'
			],
			sameAs: [
				'https://github.com/wenF7752',
				'https://www.linkedin.com/in/wenf7752/',
				'https://x.com/WenTradeFuture'
			]
		},
		{
			'@type': 'WebSite',
			'@id': WEBSITE_ID,
			url: `${SITE}/`,
			name: 'Wen Fang',
			description:
				'Personal site of Wen Fang. Projects and AI-native development workflow.',
			publisher: { '@id': PERSON_ID },
			inLanguage: 'en-US'
		},
		{
			'@type': 'ProfilePage',
			'@id': PROFILE_ID,
			url: `${SITE}/`,
			name: 'Wen Fang | AI-Native Fullstack Developer',
			isPartOf: { '@id': WEBSITE_ID },
			mainEntity: { '@id': PERSON_ID },
			about: { '@id': PERSON_ID },
			inLanguage: 'en-US'
		},
		{
			'@type': 'ItemList',
			'@id': PROJECTS_ID,
			name: 'Wen Fang — Projects',
			itemListOrder: 'https://schema.org/ItemListOrderAscending',
			numberOfItems: projects.length,
			itemListElement: projects.map(projectToListItem)
		}
	]
}

// Pre-stringified at module load. JSON.stringify never emits `</`, so safe to
// drop directly inside a <script type="application/ld+json"> block.
export const homepageJsonLd: string = JSON.stringify(graph)
