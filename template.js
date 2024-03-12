import { html } from '@aegisjsproject/core/parsers/html.js';
import { registerCallback } from '@aegisjsproject/core/callbackRegistry.js';
import { EVENTS } from '@aegisjsproject/core/events.js';
import { closeIcon } from './icons.js';

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
			<button type="button" title="Close modal" ${EVENTS.onClick}="${closeHandler}" id="close" class="btn close-btn" part="btn close" aria-label="Close Modal" aria-keyshortcuts="Escape">
				<slot name="close-icon">X</slot>
			</button>
		</div>
		<div part="body" id="body" class="body">
			<slot id="content"></slot>
		</div>
	</div>
</div>
`;

template.getElementById('close').replaceChildren(closeIcon.cloneNode(true));

export { template };
