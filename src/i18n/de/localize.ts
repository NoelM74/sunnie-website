import type { Lander } from '../../data/landers';
import type { LanderDe } from './lander-types';

/** Same lengths, or the German page would drop or misplace a photo, spec or card. */
function same(slug: string, what: string, en: unknown[] | undefined, de: unknown[] | undefined) {
  if ((en?.length ?? 0) !== (de?.length ?? 0)) throw new Error(`German lander ${slug}: ${what} has ${de?.length ?? 0} entries, English has ${en?.length ?? 0}`);
}

/** The English lander with its words swapped for the German ones. Photos, picks, prices and
 * review keys stay the English lander's, so both pages sell exactly the same thing. */
export function localizeLander(l: Lander, de: LanderDe): Lander {
  same(l.slug, 'fits.specs', l.fits.specs, de.fits.specs);
  same(l.slug, 'colours.cards', l.colours?.cards, de.colours?.cards);
  same(l.slug, 'uses.images', l.uses.images, de.uses.alts ?? (l.uses.images ? [] : undefined));
  if (!!l.sizes !== !!de.sizes) throw new Error(`German lander ${l.slug}: sizes must match the English lander`);
  return {
    ...l,
    name: de.name,
    title: de.title,
    description: de.description,
    bar: de.bar,
    barRight: de.barRight ?? 'Handgemacht von Hui',
    ships: de.ships,
    promises: de.promises,
    sizesWord: de.sizesWord,
    sizes: l.sizes && de.sizes
      ? { 1: { ...l.sizes[1], label: de.sizes[1].label }, 2: { ...l.sizes[2], label: de.sizes[2].label }, 3: { ...l.sizes[3], label: de.sizes[3].label } }
      : l.sizes,
    shop: l.shop ? [l.shop[0], l.shop[0] === '/shop/coasters/' ? 'Untersetzer' : 'Alle Taschen'] : ['/shop/bags/', 'Alle Taschen'],
    hero: { ...l.hero, h1: de.hero.h1, h1em: de.hero.h1em, sub: de.hero.sub, image: { ...l.hero.image, alt: de.hero.alt } },
    story: de.story,
    fits: { ...l.fits, h: de.fits.h, lede: de.fits.lede, specs: de.fits.specs, image: { ...l.fits.image, alt: de.fits.alt } },
    colours: l.colours && de.colours
      ? {
          h: de.colours.h,
          lede: de.colours.lede,
          note: de.colours.note,
          cards: l.colours.cards.map((c, i) => ({ ...c, title: de.colours!.cards[i].title, text: de.colours!.cards[i].text, image: { ...c.image, alt: de.colours!.cards[i].alt } })),
        }
      : undefined,
    uses: { h: de.uses.h, items: de.uses.items, images: l.uses.images?.map((im, i) => ({ ...im, alt: de.uses.alts![i] })) },
    craft: { ...l.craft, h: de.craft.h, paras: de.craft.paras, image: { ...l.craft.image, alt: de.craft.alt } },
    offer: { ...l.offer, h: de.offer.h, lede: de.offer.lede, flag2: de.offer.flag2, notes: de.offer.notes },
    faq: de.faq,
  };
}

/** A German basket label for a bundle option ("2 frogs: Green + Yellow" → "2 Frösche: Grün + Gelb"). */
export function germanOption(l: Lander, de: LanderDe, option: string): string {
  if (l.sizes && de.sizes) {
    for (const n of [1, 2, 3] as const) if (l.sizes[n].option === option) return de.sizes[n].option;
    return option;
  }
  if (l.cart) {
    for (const n of [1, 2, 3] as const) if (l.cart.options[n] === option) return `${n} ${n === 1 ? de.noun[0] : de.noun[1]}`;
    return option;
  }
  const m = /^(\d+) [^:]+: (.+)$/.exec(option);
  if (!m) return option;
  const n = Number(m[1]);
  return `${n} ${n === 1 ? de.noun[0] : de.noun[1]}: ${m[2].split(' + ').map((p) => de.picks?.[p] ?? p).join(' + ')}`;
}
