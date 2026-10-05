import { defineConfig } from 'astro/config';

// build.format 'file' emits /about.html (served at /about) so URLs stay
// identical to the legacy PHP site - no trailing slashes, no redirects.
export default defineConfig({
  site: 'https://www.karandeeparora.com',
  trailingSlash: 'never',
  build: { format: 'file' },
});
