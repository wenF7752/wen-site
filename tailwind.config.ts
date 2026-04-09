import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace']
			},
			colors: {
				brand: {
					primary: '#10b981', // Emerald (bright for dark mode)
					accent: '#3b82f6' // Blue (bright for dark mode)
				},
				surface: {
					50: '#F8FAFC',
					100: '#F1F5F9',
					200: '#E2E8F0',
					300: '#CBD5E1',
					400: '#94A3B8',
					500: '#64748B',
					600: '#475569',
					700: '#334155',
					800: '#1E293B',
					900: '#0F172A',
					950: '#020617'
				}
			}
		}
	},

	plugins: []
} satisfies Config;
