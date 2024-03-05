import { html } from '@aegisjsproject/core/parsers/html.js';
import { css } from '@aegisjsproject/core/parsers/css.js';
import { AegisComponent } from '@aegisjsproject/component/base.js';
import { SYMBOLS, TRIGGERS } from '@aegisjsproject/component/consts.js';
import { dark, light } from '@aegisjsproject/styles/palette/gnome.js';
import { registerCallback } from '@aegisjsproject/core/callbackRegistry.js';
import { EVENTS, AEGIS_EVENT_HANDLER_CLASS } from '@aegisjsproject/core/events.js';
import { closeIcon } from './icons.js';

const inertMap = new WeakMap();

const tabElsSelector = 'a[href]:not([inert]), input:not([inert]), select:not([inert]), textarea:not([inert]), button:not([inert]), iframe:not([inert]), audio:not([inert]), video:not([inert]), [tabindex]:not([inert]), [contenteditable="true"]:not([inert], [is]:defined:not([inert])';

const getCustomElements = () => Array.from(document.querySelectorAll(':defined'))
	.filter(el => el.tagName.includes('-') || el.hasAttribute('is'));

function getOtherElements(modal) {
	return [
		...Array.from(document.body.querySelectorAll(tabElsSelector)),
		...getCustomElements(modal),
	].filter(el => ! (modal.isSameNode(el) || modal.contains(el) || el.contains(modal)));
}

function toggleInert(modal, inert) {
	if (inert) {
		const els = getOtherElements(modal);
		inertMap.set(modal, els);
		els.forEach(el => el.inert = true);
	} else if (inertMap.has(modal)) {
		inertMap.get(modal).forEach(el => el.inert = false);
		inertMap.delete(modal);
	}
}

const styles = css`
	:host(:not([open])) {
		display: none;
	}

	:host([open]:not([theme])), :host([open][theme]) {
		background-color: transparent;
	}

	:host([open]) {
		position: fixed;
		z-index: 2147483647;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		isolation: isolate;
	}

	:host([open]) .backdrop {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sticky {
		position: sticky;
		top: 0;
	}

	.flex {
		display: flex;
	}

	.flex.row {
		flex-direction: row;
	}

	.flex.no-wrap {
		flex-wrap: no-wrap;
	}

	.container {
		display: flex;
		min-width: 85%;
		max-width: 95%;
		min-height: 50%;
		max-height: 95%;
		overflow: auto;
		isolation: isolate;
		flex-direction: column;
	}

	.header {
		background-color: ${dark[3]};
		color: ${light[1]};
		padding: 0.7rem;
	}

	.header-container {
		flex-grow: 1;
	}

	.close-btn {
		display: inline-block;
		width: 1.3rem;
		height: 1.3rem;
		cursor: pointer;
		background-color: transparent;
		border: none;
		box-sizing: content-box;
		color: inherit;
	}

	.body {
		background-color: ${light[1]};
		color: ${dark[4]};
		flex-grow: 1;
		padding: 0.4rem;
	}

	:host([theme="dark"]) .body {
		background-color: ${dark[2]};
		color: ${light[1]};
	}

	@media (prefers-color-scheme: dark) {
		:host(:not([theme="light"])) .body {
			background-color: ${dark[2]};
			color: ${light[1]};
		}
	}
`;

const closeHandler = registerCallback(
	'aegis-modal:close',
	event => event.target.getRootNode().host.close(),
);


const template = html`
<div part="backdrop" class="backdrop">
	<div part="container" id="container" class="container">
		<div part="header" id="header" class="header sticky top flex row no-wrap">
			<div class="header-container">
				<slot name="header"></slot>
			</div>
			<button type="button" title="Close modal" ${EVENTS.onClick}="${closeHandler}" id="close" class="btn close-btn ${AEGIS_EVENT_HANDLER_CLASS}" part="btn close" aria-label="Close Modal" aria-keyshortcuts="Escape">
				<slot name="close-icon">X</slot>
			</button>
		</div>
		<div part="body" id="body" class="body">
			<slot id="content"></slot>
		</div>
	</div>
</div>
`;

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
				shadow.getElementById('close').replaceChildren(closeIcon.cloneNode(true));
				setTimeout(() => console.log(internals), 2000);
				this.hidden = ! this.open;
				break;

			case TRIGGERS.connected:
				if (! this.parentElement.isSameNode(document.body)) {
					console.warn('<aegis-modal> should be a direct descendant of <body>.');
				}
				break;

			case TRIGGERS.discononected:
				if (this.open) {
					this.close();
				}

				if (inertMap.has(this)) {
					toggleInert(this, false);
					inertMap.delete(this);
				}
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
