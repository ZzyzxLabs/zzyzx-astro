import { SEVERITIES, STATUSES } from "../content.config";

export type Severity = (typeof SEVERITIES)[number];
export type Status = (typeof STATUSES)[number];

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  status: Status;
  fix?: string;
}

export type SeverityCounts = Record<Severity, number>;

export const severityLabels: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
  informational: "Info",
};

export const statusLabels: Record<Status, string> = {
  fixed: "Fixed",
  mitigated: "Mitigated",
  acknowledged: "Acknowledged",
  open: "Open",
  wontfix: "Won't fix",
};

const FENCED_CODE = /^([ \t]*)(`{3,}|~{3,})[\s\S]*?\n\1\2[ \t]*$/gm;
const FINDING_TAG = /<Finding\s+([^>]*?)\/?>/g;
const ATTRIBUTE = /([a-zA-Z][\w-]*)\s*=\s*"([^"]*)"/g;

function isSeverity(value: string): value is Severity {
  return (SEVERITIES as readonly string[]).includes(value);
}

function isStatus(value: string): value is Status {
  return (STATUSES as readonly string[]).includes(value);
}

/**
 * Reads the `<Finding>` tags out of a writeup body so severity counts, the summary
 * table, and the archive cards all derive from the same place the prose lives.
 * Malformed tags fail the build rather than silently dropping a finding.
 */
export function parseFindings(body: string | undefined, entryId: string): Finding[] {
  if (!body) return [];

  const prose = body.replace(FENCED_CODE, "");
  const findings: Finding[] = [];
  const seen = new Set<string>();

  for (const match of prose.matchAll(FINDING_TAG)) {
    const attributes: Record<string, string> = {};
    for (const attribute of match[1].matchAll(ATTRIBUTE)) {
      attributes[attribute[1]] = attribute[2];
    }

    const { id, title, severity, status, fix } = attributes;
    const where = `audits/${entryId}`;

    if (!id) throw new Error(`[${where}] a <Finding> tag is missing an id.`);
    if (seen.has(id)) throw new Error(`[${where}] duplicate finding id "${id}".`);
    if (!title) throw new Error(`[${where}] finding ${id} is missing a title.`);
    if (!severity || !isSeverity(severity)) {
      throw new Error(`[${where}] finding ${id} has severity "${severity}"; expected one of ${SEVERITIES.join(", ")}.`);
    }
    if (!status || !isStatus(status)) {
      throw new Error(`[${where}] finding ${id} has status "${status}"; expected one of ${STATUSES.join(", ")}.`);
    }

    seen.add(id);
    findings.push({ id, title, severity, status, fix });
  }

  return findings;
}

export function countBySeverity(findings: Finding[]): SeverityCounts {
  const counts = { critical: 0, high: 0, medium: 0, low: 0, informational: 0 };
  for (const finding of findings) counts[finding.severity] += 1;
  return counts;
}
