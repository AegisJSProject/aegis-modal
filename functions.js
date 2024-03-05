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

export function toggleInert(modal, inert) {
	if (inert) {
		const els = getOtherElements(modal);
		inertMap.set(modal, els);
		els.forEach(el => el.inert = true);
	} else if (inertMap.has(modal)) {
		inertMap.get(modal).forEach(el => el.inert = false);
		inertMap.delete(modal);
	}
}

export function renable(modal) {
	if (inertMap.has(modal)) {
		toggleInert(modal, false);
		inertMap.delete(modal);
		return true;
	} else {
		return false;
	}
}
