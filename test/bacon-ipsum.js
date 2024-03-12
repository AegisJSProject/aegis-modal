import { AegisComponent } from '@aegisjsproject/component/base.js';
import { SYMBOLS, TRIGGERS } from '@aegisjsproject/component/consts.js';
import { css } from '@aegisjsproject/core/parsers/css.js';
import { getInt, setInt } from '@aegisjsproject/component/attrs.js';

const styles = [css`:host {padding: 1.2em;}`];
const ATTRS = ['paragraphs', 'startwithlorem', 'filler'];

class BaconIpsum extends AegisComponent {
	constructor() {
		super({ styles, exportParts: ['ipsum'] });
	}

	async [SYMBOLS.render](type, { shadow, name, signal }) {
		switch(type) {
			case TRIGGERS.connected:
				shadow.replaceChildren(await this.generate({ signal }));
				break;

			case TRIGGERS.attributeChanged:
				if (ATTRS.includes(name)) {
					shadow.replaceChildren(await this.generate({ signal }));
				}
				break;
		}
	}

	get paragraphs() {
		return getInt(this, 'paragraphs', { min: 1, fallback: 5 });
	}

	set paragraphs(val) {
		setInt(this, 'paragraphs', { min: 1 });
	}

	get startWithLorem() {
		return this.hasAttribute('startwithlorem');
	}

	set startWithLorem(val) {
		this.toggleAttribute('startwithlorem', val);
	}

	get filler() {
		return this.hasAttribute('filler');
	}

	set filler(val) {
		this.toggleAttribute('filler', val);
	}

	async generate({ signal } = {}) {
		const { paragraphs, startWithLorem, filler } = this;
		const url = new URL(BaconIpsum.ENDPOINT);

		url.searchParams.set('paras', paragraphs);
		url.searchParams.set('format', 'json');

		if (startWithLorem) {
			url.searchParams.set('start-with-lorem', 1);
		}

		if (filler) {
			url.searchParams.set('type', 'meat-and-filler');
		} else {
			url.searchParams.set('type', 'all-meat');
		}

		const resp = await fetch(url, {
			referrerPolicy: 'no-referrer',
			headers: new Headers({ Accept: 'application/json' }),
			signal,
		});

		const lines = await resp.json();
		const frag = document.createDocumentFragment();

		lines.forEach(line => {
			const p = document.createElement('p');
			p.textContent = line;
			p.part.add('ipsum');
			frag.append(p);
		});

		return frag;
	}

	static get ENDPOINT() {
		return 'https://baconipsum.com/api/';
	}

	static get observedAttributes() {
		return [...AegisComponent.observedAttributes, ...ATTRS];
	}
}

BaconIpsum.register('bacon-ipsum');
