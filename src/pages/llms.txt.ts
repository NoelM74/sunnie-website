import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../data/site';
import { CATEGORY_LABELS, formatPrice, inCategory, type Category } from '../lib/products';
import { absoluteUrl } from '../lib/seo';

const CATEGORY_ORDER: Category[] = ['bags', 'coasters', 'hats'];

export const GET: APIRoute = async () => {
  const products = await getCollection('products');

  const sections = CATEGORY_ORDER.map((category) => {
    const items = inCategory(products, category)
      .map((p) => `- [${p.data.name}](${absoluteUrl(`/products/${p.id}/`)}): ${formatPrice(p.data.price)}. ${p.data.seoTitle}`)
      .join('\n');
    return `## ${CATEGORY_LABELS[category]}\n\n${items}`;
  }).join('\n\n');

  const shop = [
    ['/shop/', 'Every crochet bag, coaster and hat in one place.'],
    ['/shop/bags/', 'Crochet phone bags, crossbodies and totes.'],
    ['/shop/coasters/', 'Crochet coasters and mug rugs, singles and sets.'],
    ['/shop/hats/', 'Crochet hats, sized by age.'],
  ]
    .map(([path, desc]) => `- [${path}](${absoluteUrl(path)}): ${desc}`)
    .join('\n');

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
- Yarns are cotton, polyester or acrylic depending on the design, with no animal wool
- Orders are placed on Etsy

${sections}

## Shop

${shop}

## Pages

${pages}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
