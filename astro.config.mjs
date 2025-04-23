// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    // Add simple markdown enhancements
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
  // Update site URL to your GitHub Pages URL
  site: 'https://malaikaaiyar.me',
  // If this is not a user/organization site (username.github.io), 
  // then you need to add the repository name as base
  base: '/',
});
