<script lang="ts">
	import { onMount } from 'svelte';

	interface NetNode {
		x: number;
		y: number;
		vx: number;
		vy: number;
		pulse: number;
		hueShift: number;
		bright: boolean;
	}

	interface NetFire {
		a: number;
		b: number;
		start: number;
		dur: number;
		hue: number;
		_burst?: boolean;
	}

	interface NetBurst {
		x: number;
		y: number;
		start: number;
		dur: number;
		hue: number;
	}

	let canvas: HTMLCanvasElement | undefined = $state();

	onMount(() => {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// All mutable state lives in closure variables, not $state — RAF mutates this at 60fps.
		let nodes: NetNode[] = [];
		let fires: NetFire[] = [];
		let bursts: NetBurst[] = [];
		let nextBurst = 4 + Math.random() * 3;
		let lastW = 0;

		const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		let reducedMotion = reducedMotionQuery.matches;
		let paused = typeof document !== 'undefined' && document.hidden;

		const t0 = performance.now();
		let rafId = 0;

		const resize = () => {
			if (!canvas || !ctx) return;
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const w = canvas.clientWidth;
			const h = canvas.clientHeight;
			canvas.width = Math.max(1, Math.floor(w * dpr));
			canvas.height = Math.max(1, Math.floor(h * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};

		const buildState = (w: number, h: number) => {
			const density = Math.max(50, Math.floor((w * h) / 40000));
			nodes = [];
			for (let i = 0; i < density; i++) {
				nodes.push({
					x: Math.random() * w,
					y: Math.random() * h,
					vx: (Math.random() - 0.5) * 0.18,
					vy: (Math.random() - 0.5) * 0.18,
					pulse: Math.random() * Math.PI * 2,
					hueShift: Math.random(),
					bright: Math.random() > 0.92
				});
			}
			fires = [];
			for (let k = 0; k < Math.floor(nodes.length * 0.05); k++) {
				fires.push({
					a: Math.floor(Math.random() * nodes.length),
					b: Math.floor(Math.random() * nodes.length),
					start: Math.random() * 4,
					dur: 0.6 + Math.random() * 0.8,
					hue: Math.random()
				});
			}
			bursts = [];
			nextBurst = 4 + Math.random() * 3;
			lastW = w;
		};

		const draw = (w: number, h: number, t: number) => {
			if (!ctx) return;

			if (w !== lastW || nodes.length === 0) buildState(w, h);

			if (t > nextBurst) {
				const origin = nodes[Math.floor(Math.random() * nodes.length)];
				bursts.push({
					x: origin.x,
					y: origin.y,
					start: t,
					dur: 2.4,
					hue: Math.random()
				});
				const originIdx = nodes.indexOf(origin);
				const nearby = nodes
					.map((n, idx) => ({ idx, d: Math.hypot(n.x - origin.x, n.y - origin.y) }))
					.sort((a, b) => a.d - b.d)
					.slice(1, 9);
				nearby.forEach((cand, k) => {
					fires.push({
						a: originIdx,
						b: cand.idx,
						start: t + k * 0.06,
						dur: 0.7 + Math.random() * 0.4,
						hue: Math.random(),
						_burst: true
					});
				});
				nextBurst = t + 10 + Math.random() * 4;
			}
			bursts = bursts.filter((b) => t - b.start < b.dur);

			ctx.clearRect(0, 0, w, h);
			ctx.globalAlpha = 0.55;

			for (const n of nodes) {
				n.x += n.vx;
				n.y += n.vy;
				if (n.x < 0 || n.x > w) n.vx *= -1;
				if (n.y < 0 || n.y > h) n.vy *= -1;
			}

			const maxDist = 170;
			for (let i = 0; i < nodes.length; i++) {
				for (let j = i + 1; j < nodes.length; j++) {
					const a = nodes[i];
					const b = nodes[j];
					const dx = a.x - b.x;
					const dy = a.y - b.y;
					const d2 = dx * dx + dy * dy;
					if (d2 > maxDist * maxDist) continue;
					const d = Math.sqrt(d2);
					const strength = 1 - d / maxDist;
					const alpha = strength * 0.22;

					const mixHue = (a.hueShift + b.hueShift) * 0.5;
					const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
					const c1 = mixHue < 0.5 ? `rgba(16,185,129,${alpha})` : `rgba(20,184,166,${alpha})`;
					const c2 = mixHue < 0.5 ? `rgba(56,189,248,${alpha})` : `rgba(129,140,248,${alpha})`;
					grad.addColorStop(0, c1);
					grad.addColorStop(1, c2);
					ctx.strokeStyle = grad;
					ctx.lineWidth = 0.5 + strength * 0.5;
					ctx.beginPath();
					ctx.moveTo(a.x, a.y);
					ctx.lineTo(b.x, b.y);
					ctx.stroke();

					const phase = (t * 0.32 + (i * 0.13 + j * 0.17)) % 1;
					const px = a.x + (b.x - a.x) * phase;
					const py = a.y + (b.y - a.y) * phase;
					const pa = strength * (1 - Math.abs(phase - 0.5) * 1.4) * 0.5;
					if (pa > 0.08) {
						ctx.fillStyle = `rgba(190,245,255,${pa})`;
						ctx.beginPath();
						ctx.arc(px, py, 1.1 + strength * 0.5, 0, Math.PI * 2);
						ctx.fill();
					}
				}
			}

			for (const f of fires) {
				const elapsed = (t - f.start) % 6;
				if (elapsed < 0 || elapsed > f.dur) continue;
				const progress = elapsed / f.dur;
				const a = nodes[f.a];
				const b = nodes[f.b];
				if (!a || !b) continue;
				const intensity = Math.sin(progress * Math.PI) * 0.45;
				const color =
					f.hue < 0.5 ? `rgba(52,211,153,${intensity})` : `rgba(103,232,249,${intensity})`;
				ctx.strokeStyle = color;
				ctx.lineWidth = 0.8 + intensity * 0.8;
				ctx.beginPath();
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(b.x, b.y);
				ctx.stroke();

				const px = a.x + (b.x - a.x) * progress;
				const py = a.y + (b.y - a.y) * progress;
				ctx.fillStyle = `rgba(220,250,255,${intensity * 1.2})`;
				ctx.beginPath();
				ctx.arc(px, py, 1.6 + intensity * 1.2, 0, Math.PI * 2);
				ctx.fill();

				if (progress > 0.98) {
					f.a = Math.floor(Math.random() * nodes.length);
					f.b = Math.floor(Math.random() * nodes.length);
					f.start = t + 1 + Math.random() * 2.5;
					f.dur = 0.6 + Math.random() * 0.9;
					f.hue = Math.random();
				}
			}

			for (const n of nodes) {
				const breath = 0.5 + 0.5 * Math.sin(t * 1.4 + n.pulse);
				const r = (n.bright ? 1.8 : 1.2) + breath * 0.3;
				ctx.fillStyle =
					n.hueShift < 0.5
						? `rgba(110,231,183,${0.55 + breath * 0.25})`
						: `rgba(147,197,253,${0.55 + breath * 0.25})`;
				ctx.beginPath();
				ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
				ctx.fill();
			}

			for (const b of bursts) {
				const p = (t - b.start) / b.dur;
				if (p < 0 || p > 1) continue;
				const ease = 1 - Math.pow(1 - p, 2);
				const radius = ease * 520;
				const alpha = (1 - p) * 0.55;
				const color =
					b.hue < 0.5 ? `rgba(52,211,153,${alpha})` : `rgba(103,232,249,${alpha})`;

				ctx.strokeStyle = color;
				ctx.lineWidth = 1.6 * (1 - p) + 0.4;
				ctx.beginPath();
				ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
				ctx.stroke();

				ctx.strokeStyle =
					b.hue < 0.5
						? `rgba(110,231,183,${alpha * 0.5})`
						: `rgba(147,197,253,${alpha * 0.5})`;
				ctx.lineWidth = 0.8;
				ctx.beginPath();
				ctx.arc(b.x, b.y, radius * 0.7, 0, Math.PI * 2);
				ctx.stroke();

				const flash = Math.max(0, 1 - p * 4);
				if (flash > 0) {
					ctx.fillStyle = `rgba(230,255,252,${flash * 0.9})`;
					ctx.beginPath();
					ctx.arc(b.x, b.y, 2 + flash * 5, 0, Math.PI * 2);
					ctx.fill();
				}
			}

			ctx.globalAlpha = 1;
		};

		const loop = (now: number) => {
			if (!canvas) return;
			if (!paused && !reducedMotion) {
				const t = (now - t0) / 1000;
				draw(canvas.clientWidth, canvas.clientHeight, t);
			}
			rafId = requestAnimationFrame(loop);
		};

		// Initial sizing + first static frame (also covers the reduced-motion path).
		resize();
		draw(canvas.clientWidth, canvas.clientHeight, 0);

		const ro = new ResizeObserver(resize);
		ro.observe(canvas);

		const onVisibility = () => {
			paused = document.hidden;
		};
		document.addEventListener('visibilitychange', onVisibility);

		const onReducedMotionChange = (e: MediaQueryListEvent) => {
			reducedMotion = e.matches;
			if (reducedMotion && canvas) {
				// Hold the current frame rather than freezing mid-motion artifacts.
				draw(canvas.clientWidth, canvas.clientHeight, (performance.now() - t0) / 1000);
			}
		};
		reducedMotionQuery.addEventListener('change', onReducedMotionChange);

		rafId = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(rafId);
			ro.disconnect();
			document.removeEventListener('visibilitychange', onVisibility);
			reducedMotionQuery.removeEventListener('change', onReducedMotionChange);
		};
	});
</script>

<canvas bind:this={canvas} class="block h-full w-full"></canvas>
