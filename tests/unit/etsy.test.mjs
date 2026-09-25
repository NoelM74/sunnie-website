import { describe, expect, it } from 'vitest';
import {
  ETSY_SHOP_URL, classify, cleanDescription, findOverride, imageAlt, matchEtsyUrls,
  normaliseReviews, parseMaterials, parseOptions, setFrontmatterField, shortName,
  slugify, toMarkdown, toProduct, uniqueSlug,
} from '../../scripts/lib/etsy.mjs';

const row = (over = {}) => ({
  TITLE: 'Crochet Poodle Crossbody Bag, Fluffy Plush Phone Purse, Kids Coin Pouch',
  DESCRIPTION: 'Fluffy poodle.\n\nBag details\n� Material: 100% polyester\n  � Height: 15 cm\n**A note on sizing',
  PRICE: '26.95', CURRENCY_CODE: 'EUR', QUANTITY: '9', MATERIALS: 'Wool,Acrylic,Wool',
  IMAGE1: 'https://i.etsystatic.com/a.jpg', IMAGE2: 'https://i.etsystatic.com/b.jpg', IMAGE3: '',
  'VARIATION 1 TYPE': 'Colour', 'VARIATION 1 NAME': 'Primary colour', 'VARIATION 1 VALUES': 'White,Honey yellow,Caramel',
  'VARIATION 2 TYPE': '', 'VARIATION 2 NAME': '', 'VARIATION 2 VALUES': '',
  ...over,
});

describe('names and slugs', () => {
  it('shortens titles to a sentence-case display name without "Crochet"', () => {
    expect(shortName('Crochet Poodle Crossbody Bag, Fluffy Plush Phone Purse')).toBe('Poodle crossbody bag');
    expect(shortName('3D Flower Crochet Phone Bag, Sunflower Rose')).toBe('3D flower crochet phone bag');
    expect(shortName('Cable knit tote bag, Aran pattern')).toBe('Cable knit tote bag');
  });
  it('caps names at eight words', () => {
    expect(shortName('Crochet Animal Coasters Set of 3 Pig Bear Cat Fruit Design')).toBe('Animal coasters set of 3 pig bear cat');
  });
  it('slugifies', () => {
    expect(slugify('3D flower crochet phone bag')).toBe('3d-flower-crochet-phone-bag');
    expect(slugify('Ó Murchú & co')).toBe('o-murchu-and-co');
  });
  it('suffixes duplicate slugs', () => {
    const taken = new Set();
    expect(uniqueSlug('frog', taken)).toBe('frog');
    expect(uniqueSlug('frog', taken)).toBe('frog-2');
  });
});

describe('classify', () => {
  it.each([
    ['Crochet rose flower coaster with mini basket', { category: 'coasters' }],
    ['Crochet carnation mug rug that folds into a bouquet', { category: 'coasters' }],
    ['Rainbow Crochet Wizard Hat, Pointed Kids Winter', { category: 'hats' }],
    ['Crochet frog crossbody phone bag', { category: 'bags', group: 'characters' }],
    ['Crochet rainbow tote bag, open mesh', { category: 'bags', group: 'totes' }],
    ['Crochet Tulip Phone Bag, Sunflower Crossbody', { category: 'bags', group: 'flowers' }],
  ])('%s', (title, expected) => {
    expect(classify(title)).toEqual(expected);
  });
});

describe('cleanDescription', () => {
  it('turns broken bullets into markdown list items and removes stray bold markers', () => {
    expect(cleanDescription('Intro &lt;3\r\n\r\n\r\n� One\n  � Two\n**A note')).toBe(
      'Intro <3\n\n- One\n- Two\nA note',
    );
  });
  it('converts Unicode math-bold letters to plain text', () => {
    expect(cleanDescription('𝗣𝗿𝗼𝗱𝘂𝗰𝘁 𝗱𝗲𝘁𝗮𝗶𝗹𝘀\n🐸 Frog')).toBe('Product details\n🐸 Frog');
  });
});

describe('fields', () => {
  it('dedupes materials', () => {
    expect(parseMaterials('Wool,Acrylic,Wool, ')).toEqual(['Wool', 'Acrylic']);
  });
  it('parses variations and normalises colour names', () => {
    expect(parseOptions(row())).toEqual([{ name: 'Colour', values: ['White', 'Honey yellow', 'Caramel'] }]);
  });
  it('writes alt text', () => {
    expect(imageAlt('Poodle bag', 0, 3)).toBe('Poodle bag');
    expect(imageAlt('Poodle bag', 1, 3)).toBe('Poodle bag, photo 2 of 3');
  });
  it('finds overrides by title prefix', () => {
    const o = [{ match: 'Crochet Poodle', isNew: true }];
    expect(findOverride('Crochet Poodle Crossbody Bag', o)).toEqual({ match: 'Crochet Poodle', isNew: true });
    expect(findOverride('Other', o)).toEqual({});
  });
});

describe('toProduct and toMarkdown', () => {
  it('converts a row with overrides', () => {
    const p = toProduct(row(), { isNew: true });
    expect(p).toMatchObject({
      name: 'Poodle crossbody bag', category: 'bags', group: 'characters', price: 26.95,
      inStock: true, etsyUrl: ETSY_SHOP_URL, maker: 'Hui', isNew: true,
      imageUrls: ['https://i.etsystatic.com/a.jpg', 'https://i.etsystatic.com/b.jpg'],
    });
    expect(p.body).toContain('- Height: 15 cm');
  });
  it('marks zero quantity as sold out', () => {
    expect(toProduct(row({ QUANTITY: '0' }), {}).inStock).toBe(false);
  });
  it('lets an override replace the name and group', () => {
    const p = toProduct(row({ TITLE: 'Crochet Palm Tree Phone Bag, Yellow' }), { name: 'Palm tree phone bag', group: 'characters' });
    expect(p).toMatchObject({ name: 'Palm tree phone bag', group: 'characters' });
  });
  it('renders YAML frontmatter with relative image paths', () => {
    const md = toMarkdown(toProduct(row(), { featured: 2 }), 'poodle-crossbody-bag');
    expect(md.startsWith('---\nname: "Poodle crossbody bag"\n')).toBe(true);
    expect(md).toContain('"src":"../../assets/products/poodle-crossbody-bag/01.jpg"');
    expect(md).toContain('featured: 2');
    expect(md).toContain('\n---\n\nFluffy poodle.');
  });
});

describe('setFrontmatterField', () => {
  it('replaces an existing field', () => {
    const md = '---\nname: "A"\netsyUrl: "x"\n---\n\nBody etsyUrl: "keep"\n';
    expect(setFrontmatterField(md, 'etsyUrl', 'https://e/1')).toBe('---\nname: "A"\netsyUrl: "https://e/1"\n---\n\nBody etsyUrl: "keep"\n');
  });
  it('adds a missing field', () => {
    expect(setFrontmatterField('---\nname: "A"\n---\nB', 'size', '5 cm')).toBe('---\nname: "A"\nsize: "5 cm"\n---\nB');
  });
});

describe('normaliseReviews', () => {
  const raw = [
    { reviewer: 'noel francis', date_reviewed: '04/17/2026', star_rating: 5, message: 'Friend' },
    { reviewer: 'Nicola', date_reviewed: '07/22/2026', star_rating: 5, message: 'Eine süße Frosch Tasche' },
    { reviewer: 'hexfeather', date_reviewed: '09/25/2026', star_rating: 5, message: 'sturdy\r\ntoo' },
  ];
  it('drops excluded reviewers, adds translations, sorts newest first', () => {
    const out = normaliseReviews(raw, { 'Nicola|2026-07-22': 'A sweet frog bag' });
    expect(out.map((r) => r.reviewer)).toEqual(['hexfeather', 'Nicola']);
    expect(out[0]).toEqual({ reviewer: 'hexfeather', date: '2026-09-25', rating: 5, text: 'sturdy\ntoo', lang: 'en' });
    expect(out[1]).toMatchObject({ lang: 'de', en: 'A sweet frog bag' });
  });
});

describe('matchEtsyUrls', () => {
  it('matches exact and truncated titles, strips query strings', () => {
    const r = matchEtsyUrls(
      [{ slug: 'poodle', seoTitle: 'Crochet Poodle Crossbody Bag, Fluffy' }, { slug: 'none', seoTitle: 'Missing' }],
      [{ title: 'Crochet Poodle Crossbody Bag…', url: 'https://www.etsy.com/listing/1/poodle?ref=shop' }],
    );
    expect(r).toEqual({ matched: { poodle: 'https://www.etsy.com/listing/1/poodle' }, unmatched: ['none'] });
  });
});
