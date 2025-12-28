// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import vue from '@astrojs/vue';
import { templateCompilerOptions } from '@tresjs/core';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@tresjs/cientos', 'three']
    }
  },

  integrations: [react(), vue({
    ...templateCompilerOptions
  })]
});