import { AegisComponent } from '@aegisjsproject/component/base.js';

class HTMLHelloWorldElement extends AegisComponent {
	constructor() {
		super({
			template: '<h1><slot name="content">Hello, World!</slot></h1>',
		});
	}
}

HTMLHelloWorldElement.register('hello-world');
