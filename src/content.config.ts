import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const products = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z
      .object({
        name: z.string().min(3).max(60),
        seoTitle: z.string().min(3),
        category: z.enum(['bags', 'coasters', 'hats']),
        group: z.enum(['characters', 'flowers', 'totes']).optional(),
        price: z.number().positive(),
        inStock: z.boolean(),
        etsyUrl: z.url(),
        maker: z.string().min(1),
        options: z.array(z.object({ name: z.string(), values: z.array(z.string()).min(1) })).default([]),
        materials: z.array(z.string()).default([]),
        size: z.string().optional(),
        images: z.array(z.object({ src: image(), alt: z.string().min(3) })).min(1),
        featured: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
        isNew: z.boolean().default(false),
      })
      .refine((d) => d.category !== 'bags' || d.group !== undefined, {
        message: 'Bags need a group (characters, flowers or totes)',
        path: ['group'],
      }),
});

export const collections = { products };
