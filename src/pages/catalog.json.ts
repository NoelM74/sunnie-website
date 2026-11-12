import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import type { Catalog } from '../lib/catalog';
import { FINN_ITEM } from '../lib/finn';
import finnThumb from '../assets/finn/finn-thumb.webp';
import { LANDERS } from '../data/landers';
import { bundleCatalogItem } from '../lib/bundles';
import { landerImage } from '../lib/lander-images';
import { packFor } from '../lib/lander-products';

export const prerender = true;

function singlePackPricing(slug: string, values: string[]) {
  const pack = packFor(slug);
  if (!pack) return {};
  const keys = values.length ? values : [''];
  return {
    localPrices: { GBP: Object.fromEntries(keys.map((k) => [k, pack.price.gbp])), USD: Object.fromEntries(keys.map((k) => [k, pack.price.usd])) },
    href: `/go/${pack.lander.slug}/`,
  };
}

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
        // Products with a bundle lander charge its single-pack price list here too.
        ...singlePackPricing(p.id, opt?.values ?? []),
      }] as const;
    }),
  );
  const catalog: Catalog = Object.fromEntries(entries);
  const finn = await getImage({ src: finnThumb, width: 160, height: 160, fit: 'cover', format: 'webp' });
  catalog[FINN_ITEM.slug] = { ...FINN_ITEM, thumb: finn.src };
  // Bundle landers (/go/<slug>/): one hidden item each, whose option is the whole pack.
  for (const l of LANDERS.filter((x) => !x.cart)) {
    const thumb = await getImage({ src: landerImage((l.colours?.cards[0].image ?? l.hero.image).src), width: 160, height: 160, fit: 'cover', format: 'webp' });
    const item = bundleCatalogItem(l, thumb.src);
    catalog[item.slug] = item;
  }
  return new Response(JSON.stringify(catalog), { headers: { 'content-type': 'application/json' } });
};
