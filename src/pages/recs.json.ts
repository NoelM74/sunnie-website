import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import { LANDERS } from '../data/landers';
import { formatMoney, toLocalCents, type Currency } from '../lib/currency';
import { packFor, productHref } from '../lib/lander-products';
import { landerImage } from '../lib/lander-images';
import { FINN_ITEM } from '../lib/finn';
import type { RecCard } from '../lib/recommend';

export const prerender = true;

// Cards for "You might also like" on the thank-you page (src/lib/recommend.ts).
export const GET: APIRoute = async () => {
  const products = (await getCollection('products')).filter((p) => p.data.inStock && p.data.siteCheckout);
  const fmt = (cents: (cur: Currency) => number) => ({ EUR: formatMoney(cents('EUR'), 'EUR'), GBP: formatMoney(cents('GBP'), 'GBP'), USD: formatMoney(cents('USD'), 'USD') });
  const cards: RecCard[] = await Promise.all(products.map(async (p) => {
    const img = await getImage({ src: p.data.images[0].src, width: 480, height: 480, fit: 'cover', format: 'webp' });
    const pack = packFor(p.id);
    const eur = Math.round(Math.min(p.data.price, ...Object.values(p.data.optionPrices ?? {})) * 100);
    return {
      slug: p.id,
      name: p.data.name,
      href: productHref(p.id),
      img: img.src,
      category: p.data.category,
      group: p.data.group ?? null,
      isNew: p.data.isNew,
      featured: p.data.featured ?? null,
      price: pack ? fmt((c) => (c === 'EUR' ? pack.price.eur : c === 'GBP' ? pack.price.gbp : pack.price.usd)) : fmt((c) => toLocalCents(eur, c)),
      boughtAs: pack ? [p.id, pack.slug] : [p.id],
    };
  }));
  // Finn has no product page; his lander is the card.
  const finn = LANDERS.find((l) => l.slug === 'finn-the-shamrock');
  if (finn) {
    const img = await getImage({ src: landerImage(finn.hero.image.src), width: 480, height: 480, fit: 'cover', format: 'webp' });
    const one = (c: Currency) => (c === 'EUR' ? FINN_ITEM.optionPriceCents['1 frog'] : FINN_ITEM.localPrices[c as 'GBP' | 'USD']['1 frog']);
    cards.push({ slug: FINN_ITEM.slug, name: 'Finn & the Shamrock frog bag', href: `/go/${finn.slug}/`, img: img.src, category: 'bags', group: 'characters', isNew: false, featured: null, price: fmt(one), boughtAs: [FINN_ITEM.slug] });
  }
  return new Response(JSON.stringify(cards), { headers: { 'content-type': 'application/json' } });
};
