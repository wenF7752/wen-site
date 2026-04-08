// Re-export all supabase utilities
export { loadSupabase as getSupabaseBrowser, getSupabaseBrowser as default } from './client';
export { loadSupabase as getSupabaseServer, createAdminClient } from './server';
export type { Database } from './database.types';
