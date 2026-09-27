import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import type { Catalog } from '../lib/catalog';

export const prerender = true;

export const GET: APIRoute = async () => {
  const products = await getCollection('products');
  const entries = await Promise.all(
    products.map(async (p) => {
      const thumb = await getImage({ src: p.data.images[0].src, width: 160, height: 160, fit: 'cover', format: 'webp' });
      const opt = p.data.options[0];
      const optionPriceCents = p.data.optionPrices
        ? Object.fromEntries(Object.entries(p.data.optionPrices).map(([k, v]) => [k, Math.round(v * 100)]))
        : null;
      return [p.id, {
        slug: p.id,
        name: p.data.name,
        priceCents: Math.round(p.data.price * 100),
        inStock: p.data.inStock,
        option: opt ? { name: opt.name, values: opt.values } : null,
        optionPriceCents,
        siteCheckout: p.data.siteCheckout,
        thumb: thumb.src,
        maker: p.data.maker,
        featured: p.data.featured ?? null,
      }] as const;
    }),
  );
  const catalog: Catalog = Object.fromEntries(entries);
  return new Response(JSON.stringify(catalog), { headers: { 'content-type': 'application/json' } });
};
