export function tilt(node: HTMLElement, options?: { intensity?: number; scale?: number }) {
	const intensity = options?.intensity ?? 8;
	const scaleAmount = options?.scale ?? 1.02;

	function handleMouseMove(e: MouseEvent) {
		const rect = node.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width;
		const y = (e.clientY - rect.top) / rect.height;
		const rotateX = (0.5 - y) * intensity;
		const rotateY = (x - 0.5) * intensity;

		node.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scaleAmount})`;
	}

	function handleMouseLeave() {
		node.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
	}

	node.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
	node.style.willChange = 'transform';
	node.addEventListener('mousemove', handleMouseMove);
	node.addEventListener('mouseleave', handleMouseLeave);

	return {
		destroy() {
			node.removeEventListener('mousemove', handleMouseMove);
			node.removeEventListener('mouseleave', handleMouseLeave);
			node.style.transform = '';
			node.style.transition = '';
			node.style.willChange = '';
		}
	};
}
