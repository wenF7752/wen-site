<script lang="ts">
	import { goto } from '$app/navigation';
	import { getSupabaseBrowser } from '$lib/supabase/client';
	import Button from '$lib/components/ui/Button.svelte';
	import { Github, AlertCircle, Loader2 } from 'lucide-svelte';

	let loading = $state(false);
	let error = $state<string | null>(null);

	async function signInWithGitHub() {
		try {
			loading = true;
			error = null;

			const supabase = getSupabaseBrowser();
			const { data, error: signInError } = await supabase.auth.signInWithOAuth({
				provider: 'github',
				options: {
					redirectTo: `${window.location.origin}/api/auth/callback`
				}
			});

			if (signInError) {
				throw signInError;
			}

			// The user will be redirected to GitHub
			if (data.url) {
				window.location.href = data.url;
			}
		} catch (err) {
			console.error('Sign in error:', err);
			error = err instanceof Error ? err.message : 'Failed to sign in';
			loading = false;
		}
	}

	async function signInWithGoogle() {
		try {
			loading = true;
			error = null;

			const supabase = getSupabaseBrowser();
			const { data, error: signInError } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${window.location.origin}/api/auth/callback`
				}
			});

			if (signInError) {
				throw signInError;
			}

			if (data.url) {
				window.location.href = data.url;
			}
		} catch (err) {
			console.error('Sign in error:', err);
			error = err instanceof Error ? err.message : 'Failed to sign in';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Login | Wen Site</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-surface-50 px-4">
	<div class="w-full max-w-md">
		<!-- Logo/Header -->
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-surface-900 mb-2">Admin Login</h1>
			<p class="text-surface-600">Sign in to manage your blog</p>
		</div>

		<!-- Login Card -->
		<div class="bg-white rounded-2xl shadow-lg border border-surface-200 p-8">
			{#if error}
				<div class="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl flex items-start gap-3">
					<AlertCircle class="w-5 h-5 text-error-500 flex-shrink-0 mt-0.5" />
					<p class="text-sm text-error-700">{error}</p>
				</div>
			{/if}

			<div class="space-y-4">
				<!-- GitHub Sign In -->
				<button
					onclick={signInWithGitHub}
					disabled={loading}
					class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-surface-900 text-white rounded-xl font-medium hover:bg-surface-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{#if loading}
						<Loader2 class="w-5 h-5 animate-spin" />
						<span>Signing in...</span>
					{:else}
						<Github class="w-5 h-5" />
						<span>Continue with GitHub</span>
					{/if}
				</button>

				<!-- Google Sign In -->
				<button
					onclick={signInWithGoogle}
					disabled={loading}
					class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-surface-700 border border-surface-300 rounded-xl font-medium hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{#if loading}
						<Loader2 class="w-5 h-5 animate-spin" />
						<span>Signing in...</span>
					{:else}
						<svg class="w-5 h-5" viewBox="0 0 24 24">
							<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
							<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
							<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
							<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
						</svg>
						<span>Continue with Google</span>
					{/if}
				</button>
			</div>

			<div class="mt-6 pt-6 border-t border-surface-200">
				<p class="text-xs text-center text-surface-500">
					By signing in, you agree to our terms of service and privacy policy.
					<br />
					Only authorized administrators can access the admin panel.
				</p>
			</div>
		</div>

		<!-- Back to Site -->
		<div class="mt-6 text-center">
			<a href="/" class="text-sm text-surface-600 hover:text-surface-900 transition-colors">
				← Back to site
			</a>
		</div>
	</div>
</div>
