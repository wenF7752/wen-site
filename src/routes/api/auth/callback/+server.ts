import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * OAuth callback handler for Supabase Auth
 * Handles the exchange of auth code for session after OAuth provider redirects back
 */
export const GET: RequestHandler = async ({ url, cookies, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/admin';

	if (!code) {
		console.error('No code provided in OAuth callback');
		throw redirect(303, '/admin/login?error=no_code');
	}

	try {
		// Exchange the code for a session
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);

		if (error) {
			console.error('Session exchange error:', error);
			throw redirect(303, '/admin/login?error=session_exchange_failed');
		}

		if (!data.session) {
			console.error('No session returned from exchange');
			throw redirect(303, '/admin/login?error=no_session');
		}

		// Verify the user is an admin before redirecting to admin panel
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('role')
			.eq('id', data.session.user.id)
			.single();

		if (profileError) {
			console.error('Profile fetch error:', profileError);
		}

		// If not an admin, redirect to home page
		if ((profile as { role: string } | null)?.role !== 'admin') {
			console.warn('Non-admin user attempted login:', data.session.user.email);
			// Sign out the non-admin user
			await supabase.auth.signOut();
			throw redirect(303, '/?error=unauthorized');
		}

		// Success - redirect to admin dashboard or the 'next' URL
		throw redirect(303, next);
	} catch (err) {
		// If it's already a redirect, re-throw it
		if (err instanceof Response && err.status === 303) {
			throw err;
		}

		console.error('OAuth callback error:', err);
		throw redirect(303, '/admin/login?error=callback_failed');
	}
};
