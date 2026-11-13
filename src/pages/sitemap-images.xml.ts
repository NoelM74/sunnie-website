import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import { LANDERS } from '../data/landers';
import { LANDER_PRODUCT_SLUGS } from '../lib/lander-products';
import { landerImage } from '../lib/lander-images';
import { absoluteUrl } from '../lib/seo';

export const prerender = true;

// Image sitemap: every photo on every product and bundle page, so Google Images can find all of
// them, not only the first. Each URL is the same file the page itself shows (same width and format
// as its srcset), so Google sees the photo on the page it's listed under.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Picture skips widths larger than the photo itself, so a small photo's biggest size is its own width.
const webp = async (src: ImageMetadata, width: number) => absoluteUrl((await getImage({ src, width: Math.min(width, src.width), format: 'webp' })).src);

export const GET: APIRoute = async () => {
  const pages: { loc: string; images: string[] }[] = [];
  for (const p of await getCollection('products')) {
    if (LANDER_PRODUCT_SLUGS.includes(p.id)) continue;
    // Gallery.astro: widths 480/800/1200, webp.
    pages.push({ loc: absoluteUrl(`/products/${p.id}/`), images: await Promise.all(p.data.images.map((i) => webp(i.src, 1200))) });
  }
  for (const l of LANDERS) {
    // LanderPage.astro: hero up to 1100, fits and craft 800, colour cards 700, use photos 640.
    const shots: [string, number][] = [
      [l.hero.image.src, 1100],
      [l.fits.image.src, 800],
      ...(l.colours?.cards ?? []).map((c) => [c.image.src, 700] as [string, number]),
      ...(l.uses.images ?? []).map((i) => [i.src, 640] as [string, number]),
      [l.craft.image.src, 800],
    ];
    const urls = await Promise.all(shots.map(([src, w]) => webp(landerImage(src), w)));
    pages.push({ loc: absoluteUrl(`/go/${l.slug}/`), images: [...new Set(urls)] });
  }
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...pages.map((p) => `<url><loc>${esc(p.loc)}</loc>${p.images.map((i) => `<image:image><image:loc>${esc(i)}</image:loc></image:image>`).join('')}</url>`),
    '</urlset>',
  ].join('\n');
  return new Response(xml + '\n', { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
