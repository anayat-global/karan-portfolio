import { fetchAllPages, resolveMediaUrl } from './strapi';
import blogSeed from '../../content-seed/blog.json';
import servicesSeed from '../../content-seed/services.json';

const SITE_SLUG = 'karandeeparora';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  content: string;
  image: string;
  publishDate: Date;
  readTime: string;
  keywords: string;
}

export interface Service {
  slug: string;
  title: string;
  headline: string;
  description: string;
  content: string;
  order: number;
}

const FALLBACK_IMAGE = '/img/blog/1.jpg';

function plain(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function readTime(html: string) {
  return `${Math.max(1, Math.round(plain(html).split(' ').length / 200))} min read`;
}

function excerpt(html: string, max = 200) {
  const text = plain(html);
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

// Strapi is the source of truth. content-seed/ is the legacy-site export the
// Strapi records were migrated from; it only kicks in if Strapi is unreachable
// or has no records for this site yet, so a Strapi blip can't empty the site.
async function fromStrapi<T>(path: string, params: string): Promise<T[]> {
  try {
    return await fetchAllPages(path, `filters[sites][slug][$eq]=${SITE_SLUG}&${params}`);
  } catch (err) {
    console.warn(`[content] Strapi fetch failed for ${path}: ${err}`);
    return [];
  }
}

let blogCache: Promise<BlogPost[]> | undefined;
export function getBlogPosts(): Promise<BlogPost[]> {
  return (blogCache ??= (async () => {
    const rows: any[] = await fromStrapi('/api/blog-posts', 'sort=publishDate:desc&populate[0]=featuredImage');
    let posts: BlogPost[];
    if (rows.length) {
      posts = rows.map((p) => ({
        slug: p.slug,
        title: p.title,
        description: p.metaDescription || excerpt(p.content, 155),
        excerpt: p.excerpt || excerpt(p.content),
        content: p.content,
        image: resolveMediaUrl(p.featuredImage?.url) || FALLBACK_IMAGE,
        publishDate: new Date(p.publishDate),
        readTime: p.readTime || readTime(p.content),
        keywords: p.metaKeywords || '',
      }));
    } else {
      console.warn('[content] using local blog seed');
      posts = (blogSeed as any[]).map((p) => ({
        slug: p.slug,
        title: p.title,
        description: p.metaDescription,
        excerpt: p.excerpt,
        content: p.content,
        image: p.image || FALLBACK_IMAGE,
        publishDate: new Date(p.publishDate),
        readTime: p.readTime,
        keywords: p.metaKeywords || '',
      }));
    }
    return posts.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  })());
}

let serviceCache: Promise<Service[]> | undefined;
export function getServices(): Promise<Service[]> {
  return (serviceCache ??= (async () => {
    const rows: any[] = await fromStrapi('/api/services', 'sort=order:asc');
    if (rows.length) {
      // Strapi slugs are globally unique, so Karan's carry a prefix (see
      // scripts/migrate-to-strapi.mjs); public URLs don't.
      return rows.map((s) => ({
        slug: String(s.slug).replace(/^karandeep-/, ''),
        title: s.title,
        headline: s.shortDescription || s.title,
        description: s.metaDescription || excerpt(s.content, 155),
        content: s.content,
        order: s.order ?? 0,
      }));
    }
    console.warn('[content] using local services seed');
    return (servicesSeed as any[]).map((s) => ({
      slug: s.slug,
      title: s.title,
      headline: s.shortDescription,
      description: s.metaDescription,
      content: s.content,
      order: s.order,
    }));
  })());
}

export function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

// Legacy posts have no category field; derive one from the title/slug.
export function categoryOf(post: Pick<BlogPost, 'slug' | 'title'>) {
  const t = `${post.slug} ${post.title}`.toLowerCase();
  const map: [string, string][] = [
    ['wordpress', 'WordPress'], ['magent', 'Magento'], ['python', 'Python'], ['react', 'React JS'],
    ['twilio', 'Twilio'], ['php', 'PHP'], ['mern', 'MERN Stack'], ['full-stack', 'Freelancing'], ['full stack', 'Freelancing'],
  ];
  return map.find(([k]) => t.includes(k))?.[1] ?? 'Development';
}
