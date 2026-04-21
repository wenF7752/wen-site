/**
 * Ingestion script: embeds portfolio content into Supabase pgvector.
 *
 * Usage:
 *   1. Fill in .env with OPENAI_API_KEY, PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   2. Run the SQL migration in Supabase dashboard first
 *   3. Run: npx tsx scripts/ingest.ts
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { portfolioContent } from '../src/lib/data/portfolio-content.js';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
	console.error('Missing environment variables. Set OPENAI_API_KEY, PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env');
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function embedTexts(texts: string[]): Promise<number[][]> {
	const response = await fetch('https://api.openai.com/v1/embeddings', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${OPENAI_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model: 'text-embedding-3-small',
			input: texts
		})
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`OpenAI API error: ${response.status} ${error}`);
	}

	const data = await response.json();
	return data.data.map((item: { embedding: number[] }) => item.embedding);
}

async function main() {
	const dryRun = process.argv.includes('--dry-run');

	console.log(`Ingesting ${portfolioContent.length} content chunks${dryRun ? ' (dry run)' : ''}...`);

	// Embed first so a failing OpenAI call never leaves the table empty.
	const texts = portfolioContent.map((chunk) => chunk.text);
	console.log('Generating embeddings...');
	const embeddings = await embedTexts(texts);
	console.log(`Generated ${embeddings.length} embeddings.`);

	const rows = portfolioContent.map((chunk, i) => ({
		content: chunk.text,
		metadata: chunk.metadata,
		embedding: embeddings[i]
	}));

	if (dryRun) {
		const preview = rows[0];
		console.log(`Dry run complete. ${rows.length} rows ready to insert.`);
		console.log(`First row preview: metadata=${JSON.stringify(preview.metadata)}, content="${preview.content.slice(0, 80)}..."`);
		return;
	}

	const { error: deleteError } = await supabase.from('documents').delete().neq('id', 0);
	if (deleteError) {
		console.error('Error clearing documents:', deleteError.message);
		process.exit(1);
	}
	console.log('Cleared existing documents.');

	const { error: insertError } = await supabase.from('documents').insert(rows);
	if (insertError) {
		console.error('Error inserting documents:', insertError.message);
		process.exit(1);
	}

	console.log(`Successfully ingested ${rows.length} documents into Supabase.`);
}

main().catch((err) => {
	console.error('Ingestion failed:', err);
	process.exit(1);
});
