import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit()
	],
	css: {
		preprocessorOptions: {
			scss: {
				quietDeps: true, // Suppress dependency warnings
				logger: {
					warn: (message: string) => {
						// Suppress Bootstrap deprecation warnings
						if (message.includes('mixed-decls') || message.includes('Sass\'s behavior for declarations')) {
							return;
						}
					}
				}
			}
		}
	},
	server: {
		fs: {
			allow: ['..']
		}
	},
	define: { global: 'window' }
});
