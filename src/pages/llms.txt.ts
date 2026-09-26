import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../data/site';
import { CATEGORY_LABELS, formatPrice, inCategory, type Category } from '../lib/products';
import { absoluteUrl } from '../lib/seo';

function describe(seoTitle: string): string {
  return seoTitle.replace(/\bWool\b/g, 'yarn').replace(/\bwool\b/g, 'yarn');
}

const CATEGORY_ORDER: Category[] = ['bags', 'coasters', 'hats'];

export const GET: APIRoute = async () => {
  const products = await getCollection('products');

  const sections = CATEGORY_ORDER.map((category) => {
    const items = inCategory(products, category)
      .map((p) => `- [${p.data.name}](${absoluteUrl(`/products/${p.id}/`)}): ${formatPrice(p.data.price)}. ${describe(p.data.seoTitle)}`)
      .join('\n');
    return `## ${CATEGORY_LABELS[category]}\n\n${items}`;
  }).join('\n\n');

  const pages = [
    ['Our story', '/our-story/'],
    ['Reviews', '/reviews/'],
    ['Shipping', '/shipping/'],
    ['Care', '/care/'],
    ['Contact', '/contact/'],
  ]
    .map(([name, path]) => `- [${name}](${absoluteUrl(path)})`)
    .join('\n');

  const body = `# ${site.name}

> ${site.description}

## Key facts

- ${site.makerLine}
- Ships in ${site.shipsIn} with tracking
- Rated ${site.proof.etsyRating} on Etsy (Star Seller)
- ${site.proof.ebayPositive} positive across ${site.proof.ebayCount} eBay ratings
- Yarns are polyester and acrylic, with no animal wool
- Orders are placed on Etsy

${sections}

## Pages

${pages}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
