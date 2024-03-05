import { css } from '@aegisjsproject/core/parsers/css.js';
import { dark, light } from '@aegisjsproject/styles/palette/gnome.js';

export const styles = css`
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
