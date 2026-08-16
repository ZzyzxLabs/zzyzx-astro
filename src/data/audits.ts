export interface AuditFindingSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  informational: number;
}

export interface AuditRecord {
  project: string;
  slug: string;
  summary: string;
  ecosystem: string;
  auditType: string;
  scope: string[];
  completedAt: string;
  reportUrl?: string;
  projectUrl?: string;
  findings?: AuditFindingSummary;
}

/**
 * Only add engagements that are approved for public disclosure.
 * The Security Audit page renders an intentional empty state until a record is added.
 */
export const publishedAudits: AuditRecord[] = [];
