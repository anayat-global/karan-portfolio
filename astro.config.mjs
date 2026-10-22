import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// build.format 'file' emits /about.html (served at /about) so URLs stay
// identical to the legacy PHP site - no trailing slashes, no redirects.
export default defineConfig({
  site: 'https://www.karandeeparora.com',
  integrations: [sitemap({ filter: (page) => !/\/(thank-you|404)$/.test(page) })],
  trailingSlash: 'never',
  build: { format: 'file' },
  redirects: {
    '/wordpress-development-services': '/services/wordpress-development-services',
    '/twilio-development-services': '/services/twilio-development-services',
    '/react-js-development-services': '/services/react-js-development-services',
    '/python-development-services': '/services/python-development-services',
    '/php-development-services': '/services/php-development-services',
    '/magento-development-services': '/services/magento-development-services',
    '/backend-development-services': '/services/backend-development-services',
  },
});
