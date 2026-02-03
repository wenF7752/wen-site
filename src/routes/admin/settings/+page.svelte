<script lang="ts">
	import { Settings2 } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Settings | Admin</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-surface-900">Settings</h1>
		<p class="text-surface-600 mt-1">Manage your blog settings</p>
	</div>

	<div class="bg-white rounded-2xl p-8 shadow-sm border border-surface-200 text-center">
		<div class="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
			<Settings2 class="w-8 h-8 text-surface-400" />
		</div>
		<h2 class="text-lg font-semibold text-surface-900 mb-2">Coming Soon</h2>
		<p class="text-surface-600 max-w-md mx-auto">
			Settings will be available in a future update. This will include blog configuration,
			SEO settings, and user preferences.
		</p>
	</div>
</div>
