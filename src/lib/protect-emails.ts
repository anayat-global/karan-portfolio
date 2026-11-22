// Cloudflare rewrites email addresses in HTML into "[email protected]" placeholders (decoded again by JavaScript).
// Wrapping them in <!--email_off--> ... <!--/email_off--> tells Cloudflare to leave them alone.
// Use this on any CMS-written HTML that is inserted with set:html.
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;

import { SITE } from '../data/site';

// Some CMS text was copied from the live page after Cloudflare had hidden the address, so the literal text
// "[email protected]" is stored in the content. Put the real contact address back.
const STORED_PLACEHOLDER = /(?:<a\b[^>]*>)?\[email(?:\s|&#160;|&nbsp;)protected\](?:<\/a>)?/gi;

export function protectEmails(input: string): string {
  if (!input) return input;
  const html = input.replace(STORED_PLACEHOLDER, `<a href="mailto:${SITE.email}">${SITE.email}</a>`);
  if (!html.includes('@')) return html;
  // 1) whole mailto links
  const withLinks = html.replace(/<a\b[^>]*href=["']mailto:[^>]*>[\s\S]*?<\/a>/gi, (m) => `<!--email_off-->${m}<!--/email_off-->`);
  // 2) bare email addresses in text (outside tags and outside links that are already protected)
  let inAnchor = false;
  return withLinks
    .split(/(<!--[\s\S]*?-->|<[^>]+>)/g)
    .map((seg, i) => {
      if (i % 2 === 1) {
        if (/^<a\b/i.test(seg)) inAnchor = true;
        else if (/^<\/a>/i.test(seg)) inAnchor = false;
        return seg;
      }
      return inAnchor ? seg : seg.replace(EMAIL, (e) => `<!--email_off-->${e}<!--/email_off-->`);
    })
    .join('');
}
