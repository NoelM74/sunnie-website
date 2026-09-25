export const ETSY_SHOP_URL = 'https://www.etsy.com/shop/SunnieDesignCo';
export const EXCLUDED_REVIEWERS = ['noel francis'];

const KEEP_CASE = /\d|^[A-Z]{2,}$/;

export function shortName(title) {
  const words = title.split(',')[0].trim().split(/\s+/).filter(Boolean);
  if (words.length > 1 && words[0].toLowerCase() === 'crochet') words.shift();
  return words
    .slice(0, 8)
    .map((w, i) => {
      if (KEEP_CASE.test(w)) return w;
      const lower = w.toLowerCase();
      return i === 0 ? lower[0].toUpperCase() + lower.slice(1) : lower;
    })
    .join(' ');
}

export function slugify(text) {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function uniqueSlug(base, taken) {
  let slug = base;
  let n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;
  taken.add(slug);
  return slug;
}

const COASTER = /\b(coasters?|mug rugs?)\b/i;
const HAT = /\bhats?\b/i;
const CHARACTER = /\b(frog|poodle|dog|puppy|crab|monster|bear|panda|bunny|sheep|lamb|ostrich|giraffe|clown|girl|character|animal|mushroom|burger|overalls|lips|cat|pig)\b/i;
const TOTE = /\b(tote|backpack|cable knit|aran)\b/i;
const FLOWER = /\b(flower|floral|sunflower|rose|tulip|daisy|camellia|carnation)\b/i;

export function classify(title) {
  if (COASTER.test(title)) return { category: 'coasters' };
  if (HAT.test(title)) return { category: 'hats' };
  if (CHARACTER.test(title)) return { category: 'bags', group: 'characters' };
  if (TOTE.test(title)) return { category: 'bags', group: 'totes' };
  if (FLOWER.test(title)) return { category: 'bags', group: 'flowers' };
  return { category: 'bags', group: 'totes' };
}

const ENTITIES = { '&lt;': '<', '&gt;': '>', '&amp;': '&', '&quot;': '"', '&#39;': "'" };

export function cleanDescription(text) {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/&(lt|gt|amp|quot|#39);/g, (m) => ENTITIES[m])
    .replace(/ /g, ' ')
    .split('\n')
    .map((line) => {
      const t = line.trim().replace(/\*\*/g, '');
      const bullet = t.match(/^[�•·▪●◦]\s*(.*)$/);
      return bullet ? `- ${bullet[1].trim()}` : t;
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function parseMaterials(str) {
  return [...new Set(str.split(',').map((s) => s.trim()).filter(Boolean))];
}

export function normaliseOptionName(name) {
  if (/colou?r/i.test(name)) return 'Colour';
  const lower = name.trim().toLowerCase();
  return lower[0].toUpperCase() + lower.slice(1);
}

export function parseOptions(row) {
  const out = [];
  for (const i of [1, 2, 3]) {
    const name = (row[`VARIATION ${i} NAME`] || row[`VARIATION ${i} TYPE`] || '').trim();
    const values = (row[`VARIATION ${i} VALUES`] || '').split(',').map((v) => v.trim()).filter(Boolean);
    if (name && values.length) out.push({ name: normaliseOptionName(name), values });
  }
  return out;
}

export function imageUrls(row) {
  return Array.from({ length: 10 }, (_, i) => (row[`IMAGE${i + 1}`] || '').trim()).filter(Boolean);
}

export function imageAlt(name, i, total) {
  return i === 0 ? name : `${name}, photo ${i + 1} of ${total}`;
}

export function findOverride(title, overrides) {
  return overrides.find((o) => title.startsWith(o.match)) ?? {};
}

export function toProduct(row, override = {}) {
  const base = classify(row.TITLE);
  const category = base.category;
  const group = category === 'bags' ? override.group ?? base.group : undefined;
  return {
    name: override.name ?? shortName(row.TITLE),
    seoTitle: row.TITLE.trim(),
    category,
    ...(group ? { group } : {}),
    price: Number(row.PRICE),
    inStock: Number(row.QUANTITY) > 0,
    etsyUrl: ETSY_SHOP_URL,
    maker: 'Hui',
    options: parseOptions(row),
    materials: parseMaterials(row.MATERIALS ?? ''),
    ...(override.featured ? { featured: override.featured } : {}),
    ...(override.isNew ? { isNew: true } : {}),
    imageUrls: imageUrls(row),
    body: cleanDescription(row.DESCRIPTION ?? ''),
  };
}

export function toMarkdown(p, slug) {
  const images = p.imageUrls.map((_, i) => ({
    src: `../../assets/products/${slug}/${String(i + 1).padStart(2, '0')}.jpg`,
    alt: imageAlt(p.name, i, p.imageUrls.length),
  }));
  const fm = {
    name: p.name,
    seoTitle: p.seoTitle,
    category: p.category,
    ...(p.group ? { group: p.group } : {}),
    price: p.price,
    inStock: p.inStock,
    etsyUrl: p.etsyUrl,
    maker: p.maker,
    options: p.options,
    materials: p.materials,
    images,
    ...(p.featured ? { featured: p.featured } : {}),
    ...(p.isNew ? { isNew: true } : {}),
  };
  const lines = Object.entries(fm).map(([k, v]) => `${k}: ${JSON.stringify(v)}`);
  return `---\n${lines.join('\n')}\n---\n\n${p.body}\n`;
}

export function setFrontmatterField(md, key, value) {
  const end = md.indexOf('\n---', 3);
  const head = md.slice(0, end);
  const rest = md.slice(end);
  const line = `${key}: ${JSON.stringify(value)}`;
  const re = new RegExp(`^${key}: .*$`, 'm');
  return (re.test(head) ? head.replace(re, line) : `${head}\n${line}`) + rest;
}

export function normaliseReviews(raw, translations = {}) {
  return raw
    .filter((r) => !EXCLUDED_REVIEWERS.includes(r.reviewer.trim().toLowerCase()))
    .map((r) => {
      const [m, d, y] = r.date_reviewed.split('/');
      const date = `${y}-${m}-${d}`;
      const en = translations[`${r.reviewer}|${date}`];
      return {
        reviewer: r.reviewer,
        date,
        rating: r.star_rating,
        text: r.message.replace(/\r\n?/g, '\n').trim(),
        lang: en ? 'de' : 'en',
        ...(en ? { en } : {}),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

const norm = (s) =>
  s.toLowerCase().replace(/&amp;/g, '&').replace(/(…|\.\.\.)\s*$/, '').replace(/\s+/g, ' ').trim();

export function matchEtsyUrls(products, links) {
  const matched = {};
  const unmatched = [];
  for (const p of products) {
    const t = norm(p.seoTitle);
    const hit = links.find((l) => {
      const lt = norm(l.title);
      return lt.length > 10 && (lt === t || t.startsWith(lt) || lt.startsWith(t));
    });
    if (hit) matched[p.slug] = hit.url.split('?')[0];
    else unmatched.push(p.slug);
  }
  return { matched, unmatched };
}
