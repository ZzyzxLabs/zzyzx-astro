# Publishing a security writeup

Every public audit report and incident analysis is one MDX file. The archive pages, severity
counts, summary tables and OG metadata are all derived from that file — there is nothing to
register, no index to update, and no second place to keep in sync.

## Where things live

| Path | What it is |
|---|---|
| `src/content/audits/<slug>.mdx` | the writeup. Filename becomes the URL slug |
| `public/reports/<slug>.pdf` | the formal deliverable, if there is one |
| `src/content.config.ts` | the frontmatter schema — the authority on every field |
| `src/lib/findings.ts` | parses `<Finding>` tags out of the body |

The file produces these routes:

- `/security-audit/<slug>` — the writeup itself
- `/security-audit/reports` — every `kind: audit` entry
- `/security-audit/incidents` — every `kind: incident` entry
- `/security-audit` — the four most recent of each, on the landing page

> Only `.md` / `.mdx` files that are writeups belong in `src/content/audits/`. The loader globs
> `**/*.{md,mdx}` under that directory and validates everything it finds, so a stray README or
> template file fails the build with `InvalidContentEntryDataError`. Docs go here in `docs/`.

## 1. Copy a template

The two example entries are working templates. Copy the one that matches what you are writing:

```bash
cp src/content/audits/example-audit-writeup.mdx src/content/audits/meridian-vault.mdx
```

- `example-audit-writeup.mdx` — a client engagement (`kind: audit`)
- `example-incident-writeup.mdx` — a public exploit reconstruction (`kind: incident`)

Pick the slug carefully. It is the permanent URL; renaming it later breaks inbound links.

## 2. Fill in the frontmatter

Required on every entry:

| Field | Notes |
|---|---|
| `kind` | `audit` or `incident`. Decides which index it lands in and which dossier fields render |
| `title` | The finding in one sentence, not a label. "Reserve accounting let a redeemer round the pool down" |
| `project` | Client or protocol name, as it should appear publicly |
| `summary` | 2–3 sentences. Used for the standfirst, the meta description, and social cards |
| `ecosystem` | e.g. `Sui / Move`, `EVM / Solidity` |
| `publishedAt` | `YYYY-MM-DD`. Sorts the archive, newest first |

Two gates control whether the page ever exists — both default to *not published*:

| Field | Default | Effect |
|---|---|---|
| `disclosure` | **`private`** | Only `public` is ever built. Omit it and the writeup silently never appears |
| `draft` | `false` | `true` renders in `pnpm dev` but is excluded from production builds |

Optional blocks:

- **`target`** — what was reviewed. `repository`, `repositoryUrl`, `commit`, `language`,
  `scope` (list of files), `reviewWindow`, `reviewers` (list). Renders as the dossier panel.
  Name the exact commit; a report against "main" is not a report.
- **`incident`** — `kind: incident` only. `occurredAt`, `chain`, `lossUsd` (a **number**, not
  `"$4.2M"`), `rootCause`, `transactions` and `references` (each a list of `{label, url}`).
- **`report`** — the PDF. `pdf` (path under `public/`), `sha256`, `pages`.
- **`cover`** — image path for the social card. **`projectUrl`** — the client's site.

## 3. Write the body

Plain MDX below the frontmatter. Prose, `##` headings, code fences, tables and blockquotes all
carry house styling automatically — write markdown, not classes.

Findings are the one structured part. Each one is a `<Finding>` tag:

````mdx
<Finding
  id="ZZX-2026-001"
  title="Redeem rounds the burn down, leaving dust in the caller's favour"
  severity="high"
  status="fixed"
  fix="https://github.com/org/repo/commit/abc1234"
>

**Impact.** Who loses what, and how much it costs to pull off.

**Where.** `sources/vault.move:214-238`

```move
public fun redeem(...) { /* the vulnerable lines, not the whole file */ }
```

**Path.** The sequence an attacker actually runs, in order.

**Fix.** The change, and what now asserts the property.

</Finding>
````

The contract, enforced by `src/lib/findings.ts`:

- `id`, `title`, `severity`, `status` are **required**; `fix` (a URL) is optional.
- `severity` — `critical` · `high` · `medium` · `low` · `informational`
- `status` — `fixed` · `mitigated` · `acknowledged` · `open` · `wontfix`
- Attribute values must use **double quotes**. Single quotes and braces are not parsed.
- `id` must be unique within the file.
- A malformed tag **fails the build** with the file and finding named. It is never dropped
  silently, so counts can't drift from the prose.
- No import needed — `Finding` is injected when the page renders.
- Tags inside fenced code blocks are ignored, so you can document the format in a writeup.

Two MDX details that will bite you:

- **Blank lines are required** after the opening `<Finding ...>` and before `</Finding>`.
  Without them MDX treats the inner content as JSX, not markdown, and the prose renders raw.
- Attribute values cannot contain `>`.

Severity is not just a label any more: the highest severity in a writeup colours its row in the
archive, and each finding block carries its own severity tone. Grading a medium as high is now
visible from the index page.

## 4. Attach the PDF

Drop it in `public/reports/` and reference it from the `report` block:

```yaml
report:
  pdf: /reports/meridian-vault.pdf
  sha256: "…"
  pages: 24
```

Generate the hash so a reader can verify the file they downloaded:

```bash
sha256sum public/reports/meridian-vault.pdf
```

## 5. Preview

```bash
pnpm dev
```

Drafts are visible in dev, so you can review the real page before it ships. Check
`/security-audit/<slug>`, then both index pages, then the landing page — a writeup shows up in
three places and the severity badges should agree everywhere.

## 6. Publish

Flip both gates:

```yaml
disclosure: public
draft: false
```

For client work, `disclosure: public` means the client has approved publication. Use
`embargoed` while you are waiting for that approval — it keeps the file in the repo and out of
the build.

```bash
pnpm build
```

The build fails loudly on a malformed finding or a bad frontmatter field. A clean build means
the writeup, both indexes and the landing page are all consistent.

## Things that will bite you

- **Nothing appears in production.** Almost always `disclosure` (defaults to `private`) or
  `draft: true`. Both example entries are drafts, which is why a production build currently
  produces no writeup pages at all.
- **`lossUsd` rejected.** It is a number: `4200000`, not `"$4.2M"`.
- **Dates rejected.** `publishedAt` and `occurredAt` are dates: `2026-08-10`, unquoted.
- **Finding prose renders as raw JSX.** Missing blank line after the opening tag.
- **Build fails on a file you just added to the content folder.** Only writeups belong there.

## Checklist

- [ ] Slug is the permanent URL you want
- [ ] `kind` matches the index you expect it in
- [ ] `target.commit` names the exact reviewed commit
- [ ] Every finding has evidence: impact, location, reproducible path, fix
- [ ] Severities you would defend to the client
- [ ] `status` reflects where remediation actually landed
- [ ] PDF in `public/reports/` with a matching `sha256`
- [ ] Previewed as a draft in `pnpm dev`
- [ ] Client approved disclosure (client work only)
- [ ] `disclosure: public`, `draft: false`, `pnpm build` clean
