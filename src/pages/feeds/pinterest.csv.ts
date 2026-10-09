import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import { site } from '../../data/site';
import { CATEGORY_LABELS, GROUP_LABELS } from '../../lib/products';
import { absoluteUrl, firstSentences } from '../../lib/seo';

export const prerender = true;

/** Google product taxonomy paths, which Pinterest also uses. */
const GOOGLE_CATEGORY: Record<string, string> = {
  bags: 'Apparel & Accessories > Handbags, Wallets & Cases > Handbags',
  hats: 'Apparel & Accessories > Clothing Accessories > Hats',
  coasters: 'Home & Garden > Kitchen & Dining > Barware > Coasters',
};

const HEADERS = [
  'id', 'title', 'description', 'link', 'image_link', 'price', 'availability',
  'condition', 'brand', 'google_product_category', 'product_type', 'additional_image_link',
];

const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;

/** Pinterest catalog feed, rebuilt with the site so it always matches the product pages.
 * One row per product at its lowest ("From") price. No review columns: Etsy reviews are
 * shop-level, not per product. */
export const GET: APIRoute = async () => {
  const products = (await getCollection('products')).sort((a, b) => a.id.localeCompare(b.id));
  const rows = await Promise.all(
    products.map(async (p) => {
      const photo = async (src: ImageMetadata) => absoluteUrl((await getImage({ src, width: 1000, format: 'jpg' })).src);
      const [main, ...extra] = p.data.images;
      const extras = await Promise.all(extra.slice(0, 10).map((i) => photo(i.src)));
      const type = p.data.group ? `${CATEGORY_LABELS[p.data.category]} > ${GROUP_LABELS[p.data.group]}` : CATEGORY_LABELS[p.data.category];
      return [
        `SD-${p.id.toUpperCase()}`,
        p.data.seoTitle ?? p.data.name,
        firstSentences(p.body ?? '', 4),
        absoluteUrl(`/products/${p.id}/`),
        await photo(main.src),
        `${p.data.price.toFixed(2)} EUR`,
        p.data.inStock ? 'in stock' : 'out of stock',
        'new',
        site.name,
        GOOGLE_CATEGORY[p.data.category] ?? '',
        type,
        extras.join(','),
      ].map(cell).join(',');
    }),
  );
  const csv = [HEADERS.join(','), ...rows].join('\r\n') + '\r\n';
  return new Response(csv, { headers: { 'content-type': 'text/csv; charset=utf-8' } });
};
