import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';
import type { Database } from './database.types';

/**
 * Creates a Supabase client for server-side usage with cookie-based session handling
 * Used in server hooks, API routes, and server-side load functions
 */
export const loadSupabase = (cookies: Cookies) => {
	return createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => cookies.get(key),
			set: (key, value, options) => {
				cookies.set(key, value, {
					...options,
					path: '/',
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax'
				});
			},
			remove: (key, options) => {
				cookies.delete(key, {
					...options,
					path: '/'
				});
			}
		}
	});
};

/**
 * Creates a Supabase admin client with service role key
 * WARNING: This bypasses RLS policies. Use only for admin operations.
 */
export const createAdminClient = (cookies: Cookies) => {
	if (!SUPABASE_SERVICE_ROLE_KEY) {
		throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined');
	}

	return createServerClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		cookies: {
			get: (key) => cookies.get(key),
			set: (key, value, options) => {
				cookies.set(key, value, {
					...options,
					path: '/',
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax'
				});
			},
			remove: (key, options) => {
				cookies.delete(key, {
					...options,
					path: '/'
				});
			}
		},
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	});
};
