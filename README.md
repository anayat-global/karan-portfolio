# karan-portfolio

Astro site for karandeeparora.com (Karandeep Arora, freelance full stack developer).

- **URLs match the legacy PHP site exactly** (`/about`, `/wordpress-development-services`, `/blog/<slug>`, ...). `build.format: 'file'` keeps them extensionless; `public/_redirects` handles three legacy junk URLs.
- **Content** comes from the shared Strapi (`api.anayatglobalworks.com`, site slug `karandeeparora`). `content-seed/` is the legacy export and is only a fallback if Strapi is unreachable or empty. Karan's service slugs carry a `karandeep-` prefix in Strapi (slugs are globally unique) and are stripped on the site.
- **Contact form** posts to the shared `lead-submissions` endpoint with Cloudflare Turnstile, `sourceSite: karandeeparora.com`.
- `scripts/migrate-to-strapi.mjs` loads `content-seed/` into Strapi (dry run by default, `--apply` with `STRAPI_TOKEN`).

```
pnpm install && pnpm dev
```
