<script lang="ts">
	import { FileText, Plus } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
</script>

<svelte:head>
	<title>Posts | Admin</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold text-surface-900">Posts</h1>
			<p class="text-surface-600 mt-1">Manage your blog posts</p>
		</div>
		<Button href="/admin/posts/new" variant="primary">
			<Plus class="w-4 h-4 mr-2" />
			New Post
		</Button>
	</div>

	<!-- Empty State -->
	<div class="bg-white rounded-2xl p-12 shadow-sm border border-surface-200 text-center">
		<div class="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
			<FileText class="w-8 h-8 text-surface-400" />
		</div>
		<h2 class="text-lg font-semibold text-surface-900 mb-2">No posts yet</h2>
		<p class="text-surface-600 mb-6 max-w-md mx-auto">
			Start writing your first blog post to share your thoughts with the world.
		</p>
		<Button href="/admin/posts/new" variant="primary">
			<Plus class="w-4 h-4 mr-2" />
			Create your first post
		</Button>
	</div>
</div>
