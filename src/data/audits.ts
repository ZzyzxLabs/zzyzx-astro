import { getCollection, type CollectionEntry } from "astro:content";
import { countBySeverity, parseFindings, type Finding, type SeverityCounts } from "../lib/findings";

export type AuditEntry = CollectionEntry<"audits">;
export type AuditKind = AuditEntry["data"]["kind"];

export interface AuditRecord {
  entry: AuditEntry;
  slug: string;
  href: string;
  findings: Finding[];
  counts: SeverityCounts;
}

export const kindLabels: Record<AuditKind, string> = {
  audit: "Audit report",
  incident: "Incident analysis",
};

function toRecord(entry: AuditEntry): AuditRecord {
  const findings = parseFindings(entry.body, entry.id);
  return {
    entry,
    slug: entry.id,
    href: `/security-audit/${entry.id}`,
    findings,
    counts: countBySeverity(findings),
  };
}

/**
 * Everything that may be served. `disclosure` gates client-approved work;
 * drafts stay visible in dev so a writeup can be previewed before it ships.
 */
export async function getPublishedAudits(kind?: AuditKind): Promise<AuditRecord[]> {
  const entries = await getCollection("audits", ({ data }) => {
    if (data.disclosure !== "public") return false;
    if (data.draft && import.meta.env.PROD) return false;
    return kind ? data.kind === kind : true;
  });

  return entries
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
    .map(toRecord);
}

export function formatAuditDate(date: Date): string {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", timeZone: "UTC" });
}

export function formatAuditDay(date: Date): string {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}
