export function magnetic(node: HTMLElement, options?: { strength?: number; radius?: number }) {
	const strength = options?.strength ?? 0.3;
	const radius = options?.radius ?? 100;

	function handleMouseMove(e: MouseEvent) {
		const rect = node.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		const dx = e.clientX - centerX;
		const dy = e.clientY - centerY;
		const dist = Math.sqrt(dx * dx + dy * dy);

		if (dist < radius) {
			const pull = (1 - dist / radius) * strength;
			node.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
		}
	}

	function handleMouseLeave() {
		node.style.transform = 'translate(0px, 0px)';
	}

	node.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
	node.style.willChange = 'transform';
	document.addEventListener('mousemove', handleMouseMove);
	node.addEventListener('mouseleave', handleMouseLeave);

	return {
		destroy() {
			document.removeEventListener('mousemove', handleMouseMove);
			node.removeEventListener('mouseleave', handleMouseLeave);
			node.style.transform = '';
			node.style.transition = '';
			node.style.willChange = '';
		}
	};
}
