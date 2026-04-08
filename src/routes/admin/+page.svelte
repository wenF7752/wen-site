<script lang="ts">
	import { LayoutDashboard, FileText, Plus, Eye } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';

	// Mock stats - will be replaced with real data
	const stats = [
		{ label: 'Total Posts', value: 0, icon: FileText },
		{ label: 'Published', value: 0, icon: Eye },
		{ label: 'Drafts', value: 0, icon: FileText }
	];

	const quickActions = [
		{ label: 'New Post', href: '/admin/posts/new', icon: Plus, variant: 'primary' },
		{ label: 'View Posts', href: '/admin/posts', icon: FileText, variant: 'secondary' }
	] as const;
</script>

<svelte:head>
	<title>Admin Dashboard | Wen Site</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-surface-900">Dashboard</h1>
		<p class="text-surface-600 mt-1">Welcome to your blog admin panel</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
		{#each stats as stat}
			<div class="bg-white rounded-2xl p-6 shadow-sm border border-surface-200">
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
						<stat.icon class="w-6 h-6 text-primary-600" />
					</div>
					<div>
						<p class="text-2xl font-bold text-surface-900">{stat.value}</p>
						<p class="text-sm text-surface-500">{stat.label}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Quick Actions -->
	<div class="bg-white rounded-2xl p-6 shadow-sm border border-surface-200 mb-8">
		<h2 class="text-lg font-semibold text-surface-900 mb-4">Quick Actions</h2>
		<div class="flex flex-wrap gap-4">
			{#each quickActions as action}
				<Button href={action.href} variant={action.variant}>
					<action.icon class="w-4 h-4 mr-2" />
					{action.label}
				</Button>
			{/each}
		</div>
	</div>

	<!-- Recent Posts Placeholder -->
	<div class="bg-white rounded-2xl p-6 shadow-sm border border-surface-200">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold text-surface-900">Recent Posts</h2>
			<a href="/admin/posts" class="text-sm text-primary-600 hover:text-primary-700">
				View all →
			</a>
		</div>
		<p class="text-surface-500 text-center py-8">
			No posts yet. 
			<a href="/admin/posts/new" class="text-primary-600 hover:underline">Create your first post</a>
		</p>
	</div>
</div>
