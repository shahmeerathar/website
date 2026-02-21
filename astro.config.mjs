import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://shahmeerathar.com',
  compress: true,
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  vite: {
    build: {
      cssMinify: true
    }
  }
});
