import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
  posts: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
    schema: z.object({
      title: z.string(),
      date: z.string(),           // DD.MM.YYYY
      description: z.string().optional().default(''),
      tags: z.array(z.string()).optional().default([]),
      color: z.string().optional(),
      container: z.boolean().optional().default(true),
    }),
  }),
};
