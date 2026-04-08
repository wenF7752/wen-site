/**
 * Blog-related TypeScript interfaces
 * Aligned with Supabase database schema
 */

export interface Post {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	content: string;
	cover_image?: string;
	status: 'draft' | 'published' | 'archived';
	published_at?: string;
	created_at: string;
	updated_at: string;
	author_id: string;
	tags: string[];
	meta_title?: string;
	meta_description?: string;
	view_count: number;
	author?: Profile;
}

export interface Profile {
	id: string;
	email: string;
	full_name?: string;
	avatar_url?: string;
	role: 'user' | 'admin';
	created_at?: string;
	updated_at?: string;
}

export interface PostListResponse {
	posts: Post[];
	total: number;
	limit: number;
	offset: number;
}

export interface PostFormData {
	slug: string;
	title: string;
	excerpt: string;
	content: string;
	cover_image?: string;
	tags: string[];
	status: 'draft' | 'published';
	meta_title?: string;
	meta_description?: string;
}

export interface PostFilters {
	status?: 'published' | 'draft' | 'archived' | 'all';
	tag?: string;
	search?: string;
	limit?: number;
	offset?: number;
}
