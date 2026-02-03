/**
 * Supabase Database Types
 * Auto-generated types for type-safe Supabase queries
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			posts: {
				Row: {
					id: string;
					slug: string;
					title: string;
					excerpt: string;
					content: string;
					cover_image: string | null;
					status: 'draft' | 'published' | 'archived';
					published_at: string | null;
					created_at: string;
					updated_at: string;
					author_id: string | null;
					tags: string[];
					meta_title: string | null;
					meta_description: string | null;
					view_count: number;
				};
				Insert: {
					id?: string;
					slug: string;
					title: string;
					excerpt: string;
					content: string;
					cover_image?: string | null;
					status?: 'draft' | 'published' | 'archived';
					published_at?: string | null;
					created_at?: string;
					updated_at?: string;
					author_id?: string | null;
					tags?: string[];
					meta_title?: string | null;
					meta_description?: string | null;
					view_count?: number;
				};
				Update: {
					id?: string;
					slug?: string;
					title?: string;
					excerpt?: string;
					content?: string;
					cover_image?: string | null;
					status?: 'draft' | 'published' | 'archived';
					published_at?: string | null;
					created_at?: string;
					updated_at?: string;
					author_id?: string | null;
					tags?: string[];
					meta_title?: string | null;
					meta_description?: string | null;
					view_count?: number;
				};
			};
			profiles: {
				Row: {
					id: string;
					email: string;
					full_name: string | null;
					avatar_url: string | null;
					role: 'user' | 'admin';
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					email: string;
					full_name?: string | null;
					avatar_url?: string | null;
					role?: 'user' | 'admin';
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					email?: string;
					full_name?: string | null;
					avatar_url?: string | null;
					role?: 'user' | 'admin';
					created_at?: string;
					updated_at?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			post_status: 'draft' | 'published' | 'archived';
			user_role: 'user' | 'admin';
		};
	};
}
