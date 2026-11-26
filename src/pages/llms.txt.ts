import type { APIRoute } from 'astro';
import { productHref } from '../lib/lander-products';
import { getCollection } from 'astro:content';
import { site } from '../data/site';
import { shipToList } from '../lib/checkout-form';
import { CATEGORY_LABELS, formatPrice, inCategory, type Category } from '../lib/products';
import { absoluteUrl } from '../lib/seo';
import { GIFT_GUIDES } from '../data/gift-guides';
import { GIFT_GUIDES_DE } from '../i18n/de/gift-guides';

const CATEGORY_ORDER: Category[] = ['bags', 'coasters', 'hats'];

export const GET: APIRoute = async () => {
  const products = await getCollection('products');

  const sections = CATEGORY_ORDER.map((category) => {
    const items = inCategory(products, category)
      .map((p) => `- [${p.data.name}](${absoluteUrl(productHref(p.id))}): ${formatPrice(p.data.price)}. ${p.data.seoTitle}`)
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

  const gifts = GIFT_GUIDES.map((g) => `- [${g.h1}](${absoluteUrl(`/gifts/${g.slug}/`)}): ${g.description}`)
    .concat(GIFT_GUIDES.filter((g) => GIFT_GUIDES_DE[g.slug]).map((g) => `- [${GIFT_GUIDES_DE[g.slug].h1}](${absoluteUrl(`/de/geschenke/${GIFT_GUIDES_DE[g.slug].slug}/`)}) (Deutsch): ${GIFT_GUIDES_DE[g.slug].description}`))
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
- Ships in ${site.shipsIn} with tracking; delivery after dispatch: ${site.delivery.map((d) => `${d.region} ${d.days} working days`).join(', ')}
- Rated ${site.proof.etsyRating} out of 5 by buyers
- Phone: ${site.phone.display}
- Yarns are cotton, polyester or acrylic depending on the design, with no animal wool
- Buy directly on sunniedesigns.com with PayPal or card
- Free shipping on orders of €50 (£45, $55) or more (otherwise €6, £5, $6)
- Ships to ${shipToList}
- No import charges on delivery to the EU, UK or US
- 30-day returns

${sections}

## Shop

${shop}

## Gift guides

${gifts}

## Pages

${pages}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
