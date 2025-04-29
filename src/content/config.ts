// Define the schema for your content collections
import { defineCollection, z } from 'astro:content';

// Define the schema for your blog posts
const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

// Define the schema for your images collection (if needed)
const images = defineCollection({
  type: 'data', // Use 'data' for non-markdown content
  schema: z.object({}).optional(), // Define schema if needed
});

// Export a single `collections` object to register your collections
export const collections = {
  'posts': posts,
  'images': images,
}; 