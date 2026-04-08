import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * API endpoint to check user's role
 * Used by admin layout to verify admin access
 */
export const GET: RequestHandler = async ({ locals: { supabase, safeGetSession } }) => {
	try {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { data: profile, error } = await supabase
			.from('profiles')
			.select('role')
			.eq('id', user.id)
			.single();

		if (error) {
			console.error('Role check error:', error);
			return json({ error: 'Failed to check role' }, { status: 500 });
		}

		return json({ role: (profile as { role: string } | null)?.role || 'user' });
	} catch (err) {
		console.error('Unexpected error in role check:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
