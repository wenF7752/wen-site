import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from './database.types';

/**
 * Creates a Supabase client for browser-side usage
 * Used in client-side code (Svelte components, client-side load functions)
 */
export const loadSupabase = () => {
	return createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
};

/**
 * Singleton pattern for the browser client
 * Ensures we don't create multiple clients in the browser
 */
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export const getSupabaseBrowser = () => {
	if (typeof window === 'undefined') {
		throw new Error('getSupabaseBrowser should only be called in the browser');
	}

	if (!browserClient) {
		browserClient = createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
	}

	return browserClient;
};
