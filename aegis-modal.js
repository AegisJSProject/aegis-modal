import { html } from '@aegisjsproject/core/parsers/html.js';
import { AegisComponent } from '@aegisjsproject/component/base.js';
import { SYMBOLS, TRIGGERS } from '@aegisjsproject/component/consts.js';
import { styles } from './styles.js';
import { template } from './template.js';
import { toggleInert, renable } from './functions.js';

export class AegisModalElement extends AegisComponent {
	#removeController;
	#previouslyActive;

	constructor() {
		super({ role: 'dialog', delegatesFocus: true , styles, template });
		this.returnValue = null;
	}

	async [SYMBOLS.render](type, { shadow, internals, name, newValue, assigned }) {
		switch(type) {
			case TRIGGERS.constructed:
				internals.ariaHidden = this.open ? 'false' : 'true';
				internals.ariaLabel = 'Aegis Modal Dialog';
				internals.ariaModal = 'true';
				this.hidden = ! this.open;
				break;

			case TRIGGERS.connected:
				if (! this.parentElement.isSameNode(document.body)) {
					console.warn('<aegis-modal> should be a direct descendant of <body>.');
				}
				break;

			case TRIGGERS.disconnected:
				if (this.open) {
					this.close();
				}

				renable(this);

				break;

			case TRIGGERS.slotChanged:
				if (name === 'header') {
					internals.ariaLabel = assigned.length === 0
						? 'Aegis Modal Dialog'
						: assigned.map(el => el.textContent).join(' ');
				}
				break;

			case TRIGGERS.attributeChanged:
				if (name === 'open') {
					if (typeof newValue === 'string') {
						this.returnValue = null;
						this.#previouslyActive = document.activeElement;
						toggleInert(this, true);
						this.hidden = false;
						this.ariaHidden = 'false';
						internals.states.add('--open');
						internals.states.add('--modal');

						shadow.getElementById('container').animate([
							{ opacity: 0,  transform: 'scale(0)' },
							{ opacity: 1, transform: 'none' },
						], {
							fill: 'both',
							duration: 400,
						});

						this.dispatchEvent(new Event('open'));

						const controller = new AbortController();

						document.body.addEventListener('keydown', ({ key }) => {
							if (key === 'Escape') {
								this.close();
							}
						}, {
							passive: true,
							signal: controller.signal,
						});

						this.addEventListener('close', () => controller.abort(), { once: true });
						this.focus();
					} else {
						await shadow.getElementById('container').animate([
							{ opacity: 0, transform: 'scale(0)' },
							{ opacity: 1, transform: 'none' },
						], {
							fill: 'both',
							duration: 400,
							direction: 'reverse',
						}).finished;

						toggleInert(this, false);

						this.hidden = true;
						this.ariaHidden = 'true';
						internals.states.delete('--open');
						internals.states.delete('--modal');
						this.dispatchEvent(new Event('close'));

						if (this.#previouslyActive instanceof Element) {
							this.#previouslyActive.focus();
							this.#previouslyActive = null;
						}
					}
				} else if (name === 'autoremove') {
					if (typeof newValue !== 'string') {
						if (this.#removeController instanceof AbortController) {
							this.#removeController.abort();
						}

						this.#removeController = null;
					} else if (! (this.#removeController instanceof AbortController)) {
						this.#removeController = new AbortController();
						this.addEventListener('close', () => {
							this.remove();
							this.#removeController.abort();
						}, { signal: this.#removeController.signal, once: true });
					}
				}
				break;
		}
	}

	get whenOpened() {
		const { resolve, promise } = Promise.withResolvers();

		if (this.open) {
			resolve();
		} else {
			this.addEventListener('open', () => resolve(), { once: true });
		}

		return promise;
	}

	get whenClosed() {
		const { resolve, promise } = Promise.withResolvers();

		if (this.open) {
			this.addEventListener('close', () => resolve(this.returnValue), { once: true });
		} else {
			resolve(this.returnValue);
		}

		return promise;
	}

	get autoRemove() {
		return this.hasAttribute('autoremove');
	}

	set autoRemove(val) {
		this.toggleAttribute('autoremove');
	}

	get open() {
		return this.hasAttribute('open');
	}

	set open(val) {
		this.toggleAttribute('open', val);
	}

	show({ signal } = {}) {
		if (! (signal instanceof AbortSignal)) {
			this.open = true;
		} else if (signal.aborted) {
			this.open = false;
		} else {
			this.open = true;
			const controller = new AbortController();
			this.addEventListener('close', () => controller.abort(), { once: true });
			signal.addEventListener('abort', () => this.close(), { once: true, signal: controller.signal });
		}
	}

	close(value = null) {
		this.returnValue = value;
		this.open = false;
	}

	static get observedAttributes() {
		return [...AegisComponent.observedAttributes, 'open', 'autoremove'];
	}

	static create({ header, body, signal }) {
		if (typeof header === 'string') {
			return AegisModalElement.create({
				header: html`<div slot="header">${header}</div>`,
				body: typeof body === 'string'? html`<div>${body}</div>` : body,
				signal,
			});
		} else if (typeof body === 'string') {
			return AegisModalElement.create({
				header,
				body: html`<div>${body}</div>`,
				signal,
			});
		} else {
			const modal = new AegisModalElement();

			if (header instanceof HTMLElement) {
				header.slot = 'header';
				modal.append(header);
			} else if (header instanceof DocumentFragment) {
				modal.append(header);
			}

			if (body instanceof HTMLElement) {
				modal.append(body);
			} else if (body instanceof DocumentFragment) {
				modal.append(body);
			}

			if (signal instanceof AbortSignal) {
				modal.autoRemove = true;
				document.body.append(modal);
				modal.show({ signal });
			}

			return modal;
		}
	}
}

AegisModalElement.register('aegis-modal');
