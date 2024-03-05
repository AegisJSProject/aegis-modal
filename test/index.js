customElements.whenDefined('aegis-modal').then(() => {
	const btn = document.getElementById('show-btn');
	btn.disabled = false;
	btn.addEventListener('click', () => document.querySelector('aegis-modal').show());
});
