<script lang="ts">
</script>

<footer id="contact" class="relative border-t border-white/5 py-16 text-surface-500">
	<!-- Subtle top glow -->
	<div
		class="pointer-events-none absolute -top-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent"
	></div>

	<div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
		<div>
			<span class="text-2xl font-bold tracking-tight text-surface-50">
				WEN<span class="text-brand-primary">.</span>
			</span>
			<p class="mt-2 text-sm">Engineering with AI. Shipping with Precision.</p>
		</div>

		<div class="flex gap-8">
			<a
				href="https://github.com"
				class="footer-link text-sm transition-colors hover:text-surface-50"
				target="_blank"
				rel="noopener noreferrer">GitHub</a
			>
			<a
				href="https://twitter.com"
				class="footer-link text-sm transition-colors hover:text-surface-50"
				target="_blank"
				rel="noopener noreferrer">Twitter</a
			>
			<a
				href="https://linkedin.com"
				class="footer-link text-sm transition-colors hover:text-surface-50"
				target="_blank"
				rel="noopener noreferrer">LinkedIn</a
			>
		</div>

		<p class="text-sm">
			&copy; {new Date().getFullYear()} Wen. All rights reserved.
		</p>
	</div>
</footer>

<style>
	.footer-link {
		position: relative;
	}
	.footer-link::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 0;
		height: 1px;
		background: var(--color-brand-primary);
		transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.footer-link:hover::after {
		width: 100%;
	}
</style>
