import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export function getSupabaseClient() {
	const url = publicEnv.PUBLIC_SUPABASE_URL;
	const key = env.SUPABASE_SERVICE_ROLE_KEY;

	if (!url || !key) {
		throw new Error('Missing Supabase environment variables');
	}

	return createClient(url, key);
}
