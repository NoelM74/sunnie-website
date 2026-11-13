import data from '../data/product-reviews.json';
import type { Lang } from '../i18n/lang';

// Reviews of one product (src/data/product-reviews.json), for its page and its star rating in Google.
export interface ProductReview { reviewer: string; date: string; rating: number; lang: 'en' | 'de'; text: string; en?: string; de?: string }

const all = data as unknown as Record<string, ProductReview[] | string>;
export const reviewsFor = (slug: string | undefined): ProductReview[] => {
  const r = slug ? all[slug] : undefined;
  return Array.isArray(r) ? r : [];
};
export const averageRating = (list: ProductReview[]) => Math.round((list.reduce((s, r) => s + r.rating, 0) / list.length) * 10) / 10;

/** The review in the page's language: as written, or its translation. */
export const reviewText = (r: ProductReview, lang: Lang) => (r.lang === lang ? r.text : (lang === 'de' ? r.de : r.en) ?? r.text);

/** schema.org aggregateRating and review for a Product, from reviews shown on the same page. */
export function ratingLd(list: ProductReview[], lang: Lang) {
  if (list.length === 0) return {};
  return {
    aggregateRating: { '@type': 'AggregateRating', ratingValue: averageRating(list).toFixed(1), reviewCount: list.length, bestRating: 5, worstRating: 1 },
    review: list.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.reviewer },
      datePublished: r.date,
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      reviewBody: reviewText(r, lang),
    })),
  };
}
