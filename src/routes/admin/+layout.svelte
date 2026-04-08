<script lang="ts">
	import { goto } from '$app/navigation';
	import { getSupabaseBrowser } from '$lib/supabase/client';
	import { page } from '$app/stores';
	import { LayoutDashboard, FileText, Settings, LogOut, Menu, X } from 'lucide-svelte';

	let { children, data } = $props();
	let sidebarOpen = $state(false);

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/admin/posts', label: 'Posts', icon: FileText },
		{ href: '/admin/settings', label: 'Settings', icon: Settings }
	];

	async function signOut() {
		try {
			const supabase = getSupabaseBrowser();
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			goto('/admin/login');
		} catch (err) {
			console.error('Sign out error:', err);
		}
	}

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function closeSidebar() {
		sidebarOpen = false;
	}
</script>

<div class="min-h-screen bg-surface-50 flex">
	<!-- Mobile Sidebar Overlay -->
	{#if sidebarOpen}
		<div 
			class="fixed inset-0 bg-black/50 z-40 lg:hidden" 
			onclick={closeSidebar}
			role="presentation"
		></div>
	{/if}

	<!-- Sidebar -->
	<aside 
		class="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-surface-200 transform transition-transform duration-200 lg:transform-none {sidebarOpen ? 'translate-x-0' : '-translate-x-full'}"
	>
		<div class="h-full flex flex-col">
			<!-- Logo -->
			<div class="h-16 flex items-center px-6 border-b border-surface-200">
				<a href="/admin" class="text-xl font-bold text-surface-900">
					Admin Panel
				</a>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 px-4 py-4 space-y-1">
				{#each navItems as item}
					<a
						href={item.href}
						class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors {$page.url.pathname === item.href || $page.url.pathname.startsWith(item.href + '/') ? 'bg-primary-50 text-primary-700' : 'text-surface-600 hover:bg-surface-100'}"
						onclick={closeSidebar}
					>
						<item.icon class="w-5 h-5" />
						{item.label}
					</a>
				{/each}
			</nav>

			<!-- User Section -->
			<div class="border-t border-surface-200 p-4">
				<div class="flex items-center gap-3 mb-3 px-4">
					{#if data.user?.user_metadata?.avatar_url}
						<img 
							src={data.user.user_metadata.avatar_url} 
							alt="" 
							class="w-8 h-8 rounded-full"
						/>
					{:else}
						<div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
							<span class="text-sm font-medium text-primary-700">
								{data.user?.email?.[0]?.toUpperCase() || '?'}
							</span>
						</div>
					{/if}
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-surface-900 truncate">
							{data.user?.user_metadata?.full_name || data.user?.email}
						</p>
						<p class="text-xs text-surface-500 truncate">{data.user?.email}</p>
					</div>
				</div>
				<button
					onclick={signOut}
					class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-surface-600 hover:bg-error-50 hover:text-error-700 transition-colors"
				>
					<LogOut class="w-5 h-5" />
					Sign Out
				</button>
			</div>
		</div>
	</aside>

	<!-- Main Content -->
	<div class="flex-1 flex flex-col min-w-0">
		<!-- Mobile Header -->
		<header class="lg:hidden h-16 bg-white border-b border-surface-200 flex items-center px-4">
			<button
				onclick={toggleSidebar}
				class="p-2 -ml-2 text-surface-600 hover:text-surface-900"
				aria-label="Toggle sidebar"
			>
				{#if sidebarOpen}
					<X class="w-6 h-6" />
				{:else}
					<Menu class="w-6 h-6" />
				{/if}
			</button>
			<span class="ml-3 font-semibold text-surface-900">Admin Panel</span>
		</header>

		<!-- Page Content -->
		<main class="flex-1 p-4 lg:p-8 overflow-auto">
			{@render children()}
		</main>
	</div>
</div>
