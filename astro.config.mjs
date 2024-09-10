import { defineConfig } from 'astro/config';

import db from '@astrojs/db';

import vercel from '@astrojs/vercel/static';

// https://astro.build/config
export default defineConfig({
  integrations: [db()],
  output: 'static',
  adapter: vercel(),
});
