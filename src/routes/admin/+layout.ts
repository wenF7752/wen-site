import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import type { User } from '@supabase/supabase-js';

/**
 * Admin layout load function
 * Checks authentication and admin role on the client side
 * Server-side protection is handled in hooks.server.ts
 */
export const load: LayoutLoad = async ({ data, fetch }) => {
	// Server already checked session, use the data passed from +layout.server.ts
	const { session, user } = data as unknown as { session: { user: User } | null; user: User | null };

	// If no session, redirect to login
	if (!session || !user) {
		throw redirect(303, '/admin/login');
	}

	// Verify admin role on client side as well
	try {
		const response = await fetch('/api/auth/check-role');
		if (!response.ok) {
			throw redirect(303, '/');
		}
		const { role } = await response.json();
		if (role !== 'admin') {
			throw redirect(303, '/');
		}
	} catch (err) {
		// If the fetch fails or role check fails, redirect to home
		if (err instanceof Response && err.status === 303) {
			throw err;
		}
		console.error('Role check error:', err);
		throw redirect(303, '/');
	}

	return {
		session,
		user
	};
};
