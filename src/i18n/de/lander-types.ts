import type { BundleSize } from '../../lib/bundles';

/** German copy for one bundle page. Photos, prices, picks and review keys come from the English
 * lander (src/data/landers.ts); this holds only the words. Arrays line up with the English ones
 * (same number of colour cards, use photos, specs). */
export interface LanderDe {
  name: string;
  title: string;
  description: string;
  bar: string;
  barRight?: string;
  ships?: string;
  promises?: [string, string][];
  /** Singular, plural, and "a second one" for the step-up line: ['Frosch', 'Frösche', 'einen zweiten Frosch']. */
  noun: [string, string, string];
  /** English pick → German label, for the colour chips and the basket. Missing picks show as they are. */
  picks?: Record<string, string>;
  /** Sizes landers: the box labels and the option names shown in the basket, by box. */
  sizes?: Record<BundleSize, { label: string; option: string }>;
  sizesWord?: string;
  hero: { h1: string; h1em: string; sub: string; alt: string };
  story: { h: string; paras: string[]; subH: string; subParas: string[] };
  fits: { h: string; lede: string; specs: [string, string][]; alt: string };
  colours?: { h: string; lede: string; cards: { title: string; text: string; alt: string }[]; note: string };
  uses: { h: string; items: [string, string][]; alts?: string[] };
  craft: { h: string; paras: string[]; alt: string };
  offer: { h: string; lede: string; flag2: string; notes: Record<BundleSize, string> };
  faq: { q: string; a: string }[];
}
