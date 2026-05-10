import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tech: z.array(z.string()),
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    image: z.string(),
    featured: z.boolean().default(false),
    order: z.number().optional(),
    buttonText: z.string().optional(),
  }),
});

const experience = defineCollection({
  type: 'data',
  schema: z.object({
    company: z.string(),
    role: z.string(),
    start: z.string(),
    end: z.string().optional(),
    description: z.string(),
    tech: z.array(z.string()),
    linkedinUrl: z.string().url().optional(),
  }),
});

const applications = defineCollection({
  type: 'data',
  schema: z.object({
    company: z.string(),
    role: z.string(),
    status: z.enum(['applied', 'interview', 'offer', 'rejected', 'withdrawn']),
    appliedAt: z.string(),
    link: z.string().url().optional(),
    notes: z.string().optional(),
  }),
});

export const collections = { projects, experience, applications };

