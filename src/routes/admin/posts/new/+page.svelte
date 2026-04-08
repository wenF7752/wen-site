<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
</script>

<svelte:head>
	<title>New Post | Admin</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
	<div class="flex items-center gap-4 mb-8">
		<Button href="/admin/posts" variant="ghost">
			<ArrowLeft class="w-4 h-4 mr-2" />
			Back
		</Button>
		<h1 class="text-3xl font-bold text-surface-900">New Post</h1>
	</div>

	<!-- Form Placeholder - Phase 3 will implement full editor -->
	<div class="bg-white rounded-2xl p-8 shadow-sm border border-surface-200">
		<div class="space-y-6">
			<div>
				<label for="title" class="block text-sm font-medium text-surface-700 mb-2">Title</label>
				<input
					type="text"
					id="title"
					placeholder="Enter post title..."
					class="w-full px-4 py-3 rounded-xl border border-surface-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
				/>
			</div>
			<div>
				<label for="content" class="block text-sm font-medium text-surface-700 mb-2">Content</label>
				<textarea
					id="content"
					rows="12"
					placeholder="Write your post content in Markdown..."
					class="w-full px-4 py-3 rounded-xl border border-surface-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none font-mono text-sm"
				></textarea>
			</div>
			<div class="flex items-center justify-end gap-4 pt-4 border-t border-surface-200">
				<Button href="/admin/posts" variant="ghost">Cancel</Button>
				<Button variant="secondary">Save as Draft</Button>
				<Button variant="primary">Publish</Button>
			</div>
		</div>
	</div>
</div>
