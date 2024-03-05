import nodeResolve from '@rollup/plugin-node-resolve';

const externalPackages = ['@aegisjsproject/'];

export default {
	input: 'aegis-modal.js',
	output: {
		file: 'aegis-modal.cjs',
		format: 'cjs',
	},
	plugins: [nodeResolve()],
	external: id => externalPackages.some(pkg => id.startsWith(pkg)),
};

