import type { RequestHandler } from './$types.js'

export const prerender = true

const SITE = 'https://wenfang.dev'

export const GET: RequestHandler = () => {
	const lastmod = new Date().toISOString().split('T')[0]
	const urls = [{ loc: `${SITE}/`, changefreq: 'monthly', priority: '1.0' }]

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap-0.9">
${urls
	.map(
		(u) => `	<url>
		<loc>${u.loc}</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>${u.changefreq}</changefreq>
		<priority>${u.priority}</priority>
	</url>`
	)
	.join('\n')}
</urlset>
`

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	})
}
