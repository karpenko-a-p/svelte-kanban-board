import type { Config } from '@sveltejs/kit';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from 'svelte-adapter-bun';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      '@view/*': './src/view/*',
      '@app/*': './src/app/*',
      '@routes/*': './src/routes/*',
      '@project/*': './*',
      '@src/*': './src/*',
      '@project': '.',
      '@svelte-kit/*': './.svelte-kit/types/src/routes/*'
    },
    csrf: {
      trustedOrigins: ['*']
    }
  }
} satisfies Config;
