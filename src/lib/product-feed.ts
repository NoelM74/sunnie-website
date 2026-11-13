import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import { site } from '../data/site';
import { productHref } from './lander-products';
import { CATEGORY_LABELS, GROUP_LABELS } from './products';
import { absoluteUrl, firstSentences } from './seo';

/** Google product taxonomy paths, which Pinterest also uses. */
const GOOGLE_CATEGORY: Record<string, string> = {
  bags: 'Apparel & Accessories > Handbags, Wallets & Cases > Handbags',
  hats: 'Apparel & Accessories > Clothing Accessories > Hats',
  coasters: 'Home & Garden > Kitchen & Dining > Barware > Coasters',
};

export const BASE_HEADERS = [
  'id', 'title', 'description', 'link', 'image_link', 'price', 'availability',
  'condition', 'brand', 'google_product_category', 'product_type', 'additional_image_link',
];

const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;

/** One row per product at its lowest ("From") price, shared by the Pinterest and Google feeds.
 * No review columns: Etsy reviews are shop-level, not per product. `extra` adds columns. */
export async function productFeedCsv(
  extraHeaders: string[] = [],
  extra: (priceEur: number) => string[] = () => [],
): Promise<Response> {
  const products = (await getCollection('products')).sort((a, b) => a.id.localeCompare(b.id));
  const rows = await Promise.all(
    products.map(async (p) => {
      const photo = async (src: ImageMetadata) => absoluteUrl((await getImage({ src, width: 1000, format: 'jpg' })).src);
      const [main, ...more] = p.data.images;
      const extras = await Promise.all(more.slice(0, 10).map((i) => photo(i.src)));
      const type = p.data.group ? `${CATEGORY_LABELS[p.data.category]} > ${GROUP_LABELS[p.data.group]}` : CATEGORY_LABELS[p.data.category];
      return [
        `SD-${p.id.toUpperCase()}`,
        p.data.seoTitle ?? p.data.name,
        firstSentences(p.body ?? '', 4),
        absoluteUrl(productHref(p.id)),
        await photo(main.src),
        `${p.data.price.toFixed(2)} EUR`,
        p.data.inStock ? 'in stock' : 'out of stock',
        'new',
        site.name,
        GOOGLE_CATEGORY[p.data.category] ?? '',
        type,
        extras.join(','),
        ...extra(p.data.price),
      ].map(cell).join(',');
    }),
  );
  const csv = [[...BASE_HEADERS, ...extraHeaders].join(','), ...rows].join('\r\n') + '\r\n';
  return new Response(csv, { headers: { 'content-type': 'text/csv; charset=utf-8' } });
}
