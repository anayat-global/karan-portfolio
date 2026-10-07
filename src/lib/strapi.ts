try {
  process.loadEnvFile();
} catch {
}

// STRAPI_URL is used for build-time API reads only (getStaticPaths/content
// loaders) - safe to point at a build-only origin that bypasses Cloudflare.
// STRAPI_PUBLIC_URL is baked into asset URLs (images etc.) that ship in the
// built HTML and get fetched by real visitors' browsers, so it must stay on
// the normal Cloudflare-protected domain even when STRAPI_URL doesn't.
export const STRAPI_URL = process.env.STRAPI_URL || 'https://api.anayatglobalworks.com';
export const STRAPI_PUBLIC_URL = process.env.STRAPI_PUBLIC_URL || 'https://api.anayatglobalworks.com';

export async function strapiFetch(path: string) {
  const res = await fetch(`${STRAPI_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Strapi fetch failed: ${path} -> ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export function resolveMediaUrl(url: string | undefined | null) {
  if (!url) return undefined;
  return url.startsWith('/') ? `${STRAPI_PUBLIC_URL}${url}` : url;
}

export async function fetchAllPages(path: string, params: string) {
  const results: any[] = [];
  let page = 1;
  const pageSize = 100;
  while (true) {
    const sep = params ? '&' : '';
    const json = await strapiFetch(
      `${path}?${params}${sep}pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    );
    results.push(...json.data);
    if (page >= json.meta.pagination.pageCount) break;
    page++;
  }
  return results;
}
