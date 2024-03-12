import '../aegis-modal.js';
import './bacon-ipsum.js';
import { appendTo } from '@aegisjsproject/core/dom.js';
import { html } from '@aegisjsproject/core/parsers/html.js';
import { EVENTS } from '@aegisjsproject/core/events.js';

appendTo(document.body, html`
	<header>
		<button type="button" ${EVENTS.onClick}="${() => document.querySelector('aegis-modal').show()}" accesskey="m">Show Modal</button>
	</header>
	<main>
		<bacon-ipsum></bacon-ipsum>
	</main>
	<aegis-modal>
		<h2 slot="header">Bacon Ipsum</h2>
		<bacon-ipsum></bacon-ipsum>
	</aegis-modal>
`);
