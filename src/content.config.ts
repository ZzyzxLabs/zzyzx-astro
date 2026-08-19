import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const SEVERITIES = ["critical", "high", "medium", "low", "informational"] as const;
export const STATUSES = ["fixed", "mitigated", "acknowledged", "open", "wontfix"] as const;

const reference = z.object({
  label: z.string(),
  url: z.string().url(),
});

/**
 * Writeups are authored as MDX. Finding metadata lives on the `<Finding>` tags in
 * the body, not here, so severity counts can never drift from the prose.
 * See src/lib/findings.ts.
 */
const audits = defineCollection({
  loader: glob({ base: "./src/content/audits", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    kind: z.enum(["audit", "incident"]),
    title: z.string(),
    project: z.string(),
    summary: z.string(),
    ecosystem: z.string(),
    publishedAt: z.coerce.date(),
    /** Only `public` entries are built for production. */
    disclosure: z.enum(["public", "embargoed", "private"]).default("private"),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
    projectUrl: z.string().url().optional(),

    /** The dossier panel: what exactly was reviewed. */
    target: z
      .object({
        repository: z.string().optional(),
        repositoryUrl: z.string().url().optional(),
        commit: z.string().optional(),
        language: z.string().optional(),
        scope: z.array(z.string()).default([]),
        reviewWindow: z.string().optional(),
        reviewers: z.array(z.string()).default([]),
      })
      .default({}),

    /** Present on `kind: incident` entries. */
    incident: z
      .object({
        occurredAt: z.coerce.date().optional(),
        chain: z.string().optional(),
        lossUsd: z.number().optional(),
        rootCause: z.string().optional(),
        transactions: z.array(reference).default([]),
        references: z.array(reference).default([]),
      })
      .optional(),

    /** The formal deliverable, served from public/reports/. */
    report: z
      .object({
        pdf: z.string(),
        sha256: z.string().optional(),
        pages: z.number().optional(),
      })
      .optional(),
  }),
});

export const collections = { audits };
