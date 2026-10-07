// One-off: load Karandeep Arora's legacy blog posts + service pages (content-seed/)
// into the shared Strapi backend under a new "karandeeparora" site.
//
//   node scripts/migrate-to-strapi.mjs            # dry run: reports what would happen
//   STRAPI_TOKEN=... node scripts/migrate-to-strapi.mjs --apply
//
// Safety: never updates or overwrites an existing record. A slug that already
// exists (blog slugs are globally unique across sites) is reported and skipped.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STRAPI_URL = process.env.STRAPI_URL || 'https://api.anayatglobalworks.com';
const TOKEN = process.env.STRAPI_TOKEN;
const APPLY = process.argv.includes('--apply');
const SITE = { name: 'Karandeep Arora', slug: 'karandeeparora', domain: 'www.karandeeparora.com' };

if (APPLY && !TOKEN) {
  console.error('Set STRAPI_TOKEN to use --apply.');
  process.exit(1);
}

const auth = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
const json = { ...auth, 'Content-Type': 'application/json' };
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'content-seed', f), 'utf8'));

async function exists(collection, slug) {
  const res = await fetch(`${STRAPI_URL}/api/${collection}?filters[slug][$eq]=${encodeURIComponent(slug)}&fields[0]=slug&populate[sites][fields][0]=slug`, { headers: auth });
  if (!res.ok) throw new Error(`lookup ${collection}/${slug} -> ${res.status}`);
  const { data } = await res.json();
  return data[0] ?? null;
}

async function ensureSite() {
  const res = await fetch(`${STRAPI_URL}/api/sites?filters[slug][$eq]=${SITE.slug}`, { headers: auth });
  const { data } = await res.json();
  if (data?.length) return data[0].documentId;
  if (!APPLY) return null;
  const created = await fetch(`${STRAPI_URL}/api/sites`, { method: 'POST', headers: json, body: JSON.stringify({ data: SITE }) });
  if (!created.ok) throw new Error(`create site -> ${created.status} ${await created.text()}`);
  return (await created.json()).data.documentId;
}

const uploads = new Map();
async function upload(relPath) {
  if (!relPath) return undefined;
  if (uploads.has(relPath)) return uploads.get(relPath);
  const file = path.join(ROOT, 'public', relPath);
  const form = new FormData();
  form.append('files', new Blob([fs.readFileSync(file)]), path.basename(file));
  const res = await fetch(`${STRAPI_URL}/api/upload`, { method: 'POST', headers: auth, body: form });
  if (!res.ok) { console.warn(`  image upload failed (${relPath}): ${res.status}`); return undefined; }
  const [f] = await res.json();
  uploads.set(relPath, f.id);
  return f.id;
}

async function create(collection, data, label) {
  const res = await fetch(`${STRAPI_URL}/api/${collection}`, { method: 'POST', headers: json, body: JSON.stringify({ data }) });
  console.log(res.ok ? `  CREATED ${label}` : `  FAILED  ${label} -> ${res.status} ${await res.text()}`);
  return res.ok;
}

const siteId = await ensureSite();
console.log(`${APPLY ? 'APPLY' : 'DRY RUN'} -> ${STRAPI_URL}; site "${SITE.slug}" ${siteId ? 'exists' : 'will be created'}`);

const stats = { created: 0, skipped: 0, failed: 0 };

console.log('\nBlog posts');
for (const p of read('blog.json')) {
  const found = await exists('blog-posts', p.slug);
  if (found) {
    const onSites = (found.sites ?? []).map((s) => s.slug).join(', ') || 'no site';
    console.log(`  SKIP    ${p.slug} (already exists, on: ${onSites})`);
    stats.skipped++;
    continue;
  }
  if (!APPLY) { console.log(`  WOULD CREATE ${p.slug}`); continue; }
  const image = await upload(p.image);
  const ok = await create('blog-posts', {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    metaDescription: p.metaDescription,
    metaKeywords: p.metaKeywords || undefined,
    authorName: 'Karandeep Arora',
    publishDate: p.publishDate,
    readTime: p.readTime,
    canonicalPath: `/blog/${p.slug}`,
    featuredImage: image,
    sites: [siteId],
  }, p.slug);
  ok ? stats.created++ : stats.failed++;
}

// Service slugs are globally unique in Strapi and three of Karan's (wordpress-,
// python-, php-development-services) are already taken by other sites' own
// copy, so his are stored with a prefix. The Astro site strips it again.
console.log('\nServices');
for (const svc of read('services.json')) {
  const s = { ...svc, slug: `karandeep-${svc.slug}` };
  const found = await exists('services', s.slug);
  if (found) {
    const onSites = (found.sites ?? []).map((x) => x.slug).join(', ') || 'no site';
    console.log(`  SKIP    ${s.slug} (already exists, on: ${onSites})`);
    stats.skipped++;
    continue;
  }
  if (!APPLY) { console.log(`  WOULD CREATE ${s.slug}`); continue; }
  const ok = await create('services', {
    title: s.title,
    slug: s.slug,
    shortDescription: s.shortDescription,
    content: s.content,
    metaDescription: s.metaDescription,
    order: s.order,
    canonicalPath: `/${svc.slug}`,
    sites: [siteId],
  }, s.slug);
  ok ? stats.created++ : stats.failed++;
}

console.log(`\nDone. created=${stats.created} skipped=${stats.skipped} failed=${stats.failed}`);
