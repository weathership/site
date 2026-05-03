import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/news" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    author: z.string().default("weathership"),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/projects" }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    status: z.enum(["active", "stealth", "archived"]),
    repo: z.string().url().optional(),
    docs: z.string().url().optional(),
    visibility: z.enum(["public", "private", "stealth"]).default("public"),
    order: z.number().default(0),
    summary: z.string(),
  }),
});

export const collections = { news, projects };
