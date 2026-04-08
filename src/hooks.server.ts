import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

/**
 * Supabase session handler
 * Creates a server client and manages session refresh
 */
const supabaseHandler: Handle = async ({ event, resolve }) => {
	// Create Supabase server client
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, {
					...options,
					path: '/',
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax'
				});
			},
			remove: (key) => {
				event.cookies.delete(key, { path: '/' });
			}
		}
	});

	/**
	 * Helper to get session safely
	 * Handles session refresh and validation
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (!session) {
			return { session: null, user: null };
		}

		// Validate the session by getting user
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error) {
			console.error('Auth error in safeGetSession:', error);
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

/**
 * Security headers handler
 * Adds security-related HTTP headers to all responses
 */
const securityHeadersHandler: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Security headers
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	// CSP header (adjust as needed)
	const cspDirectives = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: https:",
		"font-src 'self'",
		"connect-src 'self' https://*.supabase.co",
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self'"
	];
	response.headers.set('Content-Security-Policy', cspDirectives.join('; '));

	return response;
};

/**
 * Auth guard handler for admin routes
 * Protects /admin/* routes (except /admin/login)
 */
const authGuardHandler: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();

	// Protected admin routes (exclude login page)
	if (event.url.pathname.startsWith('/admin') && !event.url.pathname.startsWith('/admin/login')) {
		if (!session || !user) {
			throw redirect(303, '/admin/login');
		}

		// Check admin role
		const { data: profile, error } = await event.locals.supabase
			.from('profiles')
			.select('role')
			.eq('id', user.id)
			.single();

		if (error || (profile as { role: string } | null)?.role !== 'admin') {
			console.error('Admin access denied:', error || 'Not an admin');
			throw redirect(303, '/');
		}
	}

	return resolve(event);
};

// Chain all handlers
export const handle: Handle = sequence(supabaseHandler, securityHeadersHandler, authGuardHandler);
