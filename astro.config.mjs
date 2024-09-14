import { defineConfig } from 'astro/config';

import db from '@astrojs/db';

import vercel from '@astrojs/vercel/serverless';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [db(), react(), tailwind()],
  security: { checkOrigin: true },
  output: 'server',
  adapter: vercel(),
});
