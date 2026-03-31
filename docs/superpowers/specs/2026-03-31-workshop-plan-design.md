# Workshop plan update — design spec

**Date:** 2026-03-31  
**Status:** Approved (participant confirmed design)  
**Scope:** Cursor BI workshop (`docs/instructor-doc.md`, `docs/WORKSHOP.md`, `README.md`)

## Problem

The workshop taught Skills, MCP, and hooks at a high level. Participants did not have a repeatable **discover → evaluate → install → apply** path for **public** skills and lacked parallel detail for MCPs and hooks.

## Decision (Skill emphasis: Option A)

- **Primary Skill exercise:** Participants **find and install** a **public** dbt/SQL/analytics-related skill via the ecosystem ([skills.sh](https://skills.sh/), `npx skills find`), then use it in Composer with `@` references.
- **Bundled `.cursor/skills/dbt-redshift-bi/`:** **Team template only** — shown briefly as what a team versions in git when public skills are not enough. It is **not** the main hands-on skill for marts.

## Structural approach

**Replace in place:** Keep blocks **A → B → C → D → E → F** and the ~2h timing. Densify Block C (and mirror the pattern in D and E) instead of reordering (no “skills before seeds”).

## Learning outcomes (delta)

Add explicit outcome:

- **Discover** a skill via `skills.sh` / `npx skills find`, **install** non-interactively for Cursor (`npx skills add … --agent cursor -y`), and **attach** the skill in prompts.

Adjust wording: team standards remain important, but the **hands-on** skill is the **public** install, not only the repo skill.

## Block C — Skills (script)

1. **Discover:** Open [skills.sh](https://skills.sh/) or run `npx skills find dbt` (try keywords `dbt`, `sql`, `analytics` if results are sparse).
2. **Evaluate (class rubric, ~2 min):** Repo activity, relevance to facts/dimensions/tests, any CLI security hint; avoid copying skills from unknown sources without a quick scan.
3. **Install:** `npx --yes skills add <source> --skill <skill-name> --agent cursor -y` (non-interactive; avoids agent picker hang).
4. **Apply:** Composer builds or refines **marts** following the **installed** skill path (typically under `.agents/skills/<name>/` per CLI — participants `@`-mention the actual `SKILL.md`).
5. **Team template (~3–5 min):** Show `.cursor/skills/dbt-redshift-bi/SKILL.md` — internal standard in version control; compare intent vs public skill.

## Block D — MCP (script)

1. **Discover:** Cursor MCP UI / org allowlist; optional [Model Context Protocol servers](https://github.com/modelcontextprotocol/servers) catalog.
2. **Select:** One MCP for the whole room; criteria: **read-only**, no secrets in repo, fits policy (Postgres, filesystem, docs, or read-only Redshift path).
3. **Install:** Facilitator provides exact name + JSON/config snippet.
4. **Apply:** One prompt that **must** use tool output (e.g. column list, doc snippet) before writing or changing SQL.

## Block E — Hooks (script)

1. **Discover:** Cursor documentation for hooks (events available in their Cursor version).
2. **Install:** One minimal hook (e.g. remind to attach `schema.yml` or run `dbt parse`).
3. **Verify:** Deliberately vague prompt → observe guardrail.

## Block F — Capstone

Unchanged intent: task uses **public** skill + MCP awareness + hook awareness; team skill optional mention.

## Facilitator fallback

If search, DNS, or policy blocks discovery:

- Pre-approve **one or two** GitHub skill packages from [skills.sh](https://skills.sh/) before class; distribute the exact `npx skills add … --skill … --agent cursor -y` line.
- Same idea for MCP: pre-pick one approved server + config.

## Doc updates (implementation)

| File | Change |
|------|--------|
| `docs/instructor-doc.md` | Outcomes, time table row C, Parts 2–5 scripts, trainer prep (fallback one-pager), cheat sheet row for Skill |
| `docs/WORKSHOP.md` | Agenda line 3; prompts reference installed public skill path |
| `README.md` | Node prerequisite for Block C; `.cursor/skills/dbt-redshift-bi` described as team template; optional `npx skills find` |

## Out of scope

- Changing the retail mart scenario or seed data.
- Mandating a specific third-party skill package name (facilitator pre-vets per cohort).
