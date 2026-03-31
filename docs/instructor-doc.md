# Cursor BI Workshop — Instructor document

**Audience:** Business intelligence analysts who model data and build facts and dimensions with **dbt** and **Redshift**.  
**Duration:** ~2 hours.  
**Repo materials:** This repository (`seeds/`, dbt project, **team-template** skill under `.cursor/skills/dbt-redshift-bi/`).

**Design reference:** `docs/superpowers/specs/2026-03-31-workshop-plan-design.md`

---

## Learning outcomes (state these at the start)

By the end, participants should be able to:

1. Use **Chat**, **Composer**, and **@-mentions** (files, folders, docs) for dbt work.
2. **Discover** a public skill ([skills.sh](https://skills.sh/), `npx skills find`), **install** it non-interactively for Cursor (`npx skills add … --agent cursor -y`), and **use** it in prompts via `@` to the installed `SKILL.md`.
3. Recognize a **team-authored** skill in-repo (example: `.cursor/skills/dbt-redshift-bi/`) as the pattern for internal standards.
4. **Discover, install, and use** **one MCP** with clear selection criteria (read-only, policy-safe) so answers are grounded in catalogs or docs.
5. **Discover, install, and trigger** **one Hook** as a habit guardrail (e.g. context or `dbt parse`).
6. Apply all of the above on a small simulated mart: one fact + two dimensions + tests.

---

## Narrative thread (single story)

Use **one end-to-end scenario** so Skills, MCP, and hooks feel connected—not like three unrelated demos.

**Scenario:** *Retail orders mart* — analysts need a **`fct_orders`** at **order-line grain**, with **`dim_customer`** and **`dim_product`**, Redshift-oriented conventions, and dbt tests.

**Simulated inputs (this repo):**

| Asset | Purpose |
|--------|--------|
| `seeds/raw_orders.csv`, `raw_customers.csv`, `raw_products.csv` | Small synthetic datasets |
| `models/staging/`, `models/marts/` | Where participants add models |
| `dbt_project.yml` | Project config |

**Workshop deliverable:** staging → `dim_*` + `fct_orders` with surrogate keys, `not_null` / `unique` / `relationships` tests, and `schema.yml` column docs.

**Note:** Local execution uses **DuckDB** (see `README.md`); SQL and standards are framed for **Redshift** in production.

---

## Time plan (~120 minutes)

| Block | Time | Focus |
|--------|------|--------|
| **A. Cursor map** | 15 min | Chat vs Composer, context (@files, @folders, Cmd/Ctrl+K), rules vs skills (overview). |
| **B. Hands-on: dbt from seeds** | 25 min | Open project, `dbt seed`, generate staging in Composer with @seeds + @dbt_project. **No public skill required yet.** |
| **C. Public Skill** | 20 min | **Discover** (skills.sh / `npx skills find`) → **evaluate** → **install** → **apply** to marts; then **team template** walkthrough (`.cursor/skills/dbt-redshift-bi/`). |
| **D. MCP** | 25 min | **Discover** (Cursor MCP + allowlist / [MCP servers catalog](https://github.com/modelcontextprotocol/servers)) → **pick one** for the room → **install** → **apply** with a prompt that requires tool output. |
| **E. Hook** | 15 min | **Discover** (Cursor hooks docs for their version) → **install** one minimal hook → **trigger** with a vague prompt. |
| **F. Capstone + Q&A** | 20 min | Date key / `dim_date` + grain in `schema.yml` using **public** skill + MCP + hook awareness. |

**Buffer:** If installs are slow, shorten the capstone and keep Q&A.

---

## Facilitator fallback (print this)

If `find`, DNS, or policy blocks **public skill** discovery in the room:

1. **Pre-vet** one or two packages from [skills.sh](https://skills.sh/) before class (keywords: `dbt`, `sql`, `analytics`).
2. Distribute the exact install line, for example:

   `npx --yes skills add <github-url-or-package> --skill <skill-name> --agent cursor -y`

3. Participants still **open** the installed `SKILL.md` and **@** it in Composer so the learning outcome holds.

If **MCP** install is blocked org-wide: demo from the facilitator machine; participants use a **scripted prompt** that quotes your tool output, or fall back to CSV-only grain discussion.

---

## Main Cursor capabilities to demonstrate (checklist)

1. **Composer / Agent** — multi-file edits (new models + YAML).
2. **Inline edit (Cmd/Ctrl+K)** — small rewrites in a single file.
3. **Context discipline** — `@models/...`, `@seeds/...`, `@dbt_project.yml` instead of pasting entire files into chat.
4. **Terminal** — `dbt run`, `dbt test`; paste errors back into chat with @file.
5. **Rules** (e.g. `.cursor/rules`) — short always-on constraints vs **Skills** — deeper playbooks.
6. **Skills / MCP / Hooks** — repeatability, tools, automation.

---

## Hands-on script (facilitator + participants)

### Part 1 — Baseline (no public skill yet)

**Say:** *We only attach context that exists on disk.*

**Participants:**

1. Clone/open this repo in Cursor.
2. Terminal: `dbt debug` → `dbt deps` → `dbt seed`.
3. **Composer prompt (example):**

   > Using `@seeds/raw_orders.csv` `@seeds/raw_customers.csv` `@seeds/raw_products.csv` and `@dbt_project.yml`, create staging models `stg_orders`, `stg_customers`, `stg_products` in `models/staging/`. Use Redshift-friendly types, explicit casts, and snake_case. Do not invent columns beyond the CSVs.

4. Run `dbt run -s path:models/staging` (or equivalent selection) and fix failures in Chat by @-mentioning the failing file and the error text.

**Debrief:** Quality improves when seeds and project config are in context.

---

### Part 2 — Public Skill (primary exercise)

**Goal:** Repeatable **discover → evaluate → install → apply** for a **public** skill; contrast with a **team** skill in git.

**Participants:**

1. **Discover:** Visit [skills.sh](https://skills.sh/) or run `npx skills find dbt` (try `sql`, `analytics` if needed). Pick **one** skill that plausibly helps dbt modeling or SQL analytics.
2. **Evaluate (quick rubric):** Repo or maintainer credibility, relevance to facts/dimensions/tests, fit with company policy. Skim `SKILL.md` on GitHub before installing.
3. **Install (non-interactive):**

   `npx --yes skills add <source> --skill <skill-name> --agent cursor -y`

   Use the **exact** `--skill` name the package exposes; `--agent cursor -y` avoids the interactive agent picker.

4. **Locate:** Find the installed `SKILL.md` (often `.agents/skills/<skill-name>/` after the [skills CLI](https://skills.sh/) copy step). In Composer, **@** that file explicitly.
5. **Composer prompt (example):**

   > Follow `@.agents/skills/<skill-name>/SKILL.md` (adjust path to match install). Build `dim_customer`, `dim_product`, and `fct_orders` at **order line** grain from staging. Add `models/marts/schema.yml` with descriptions and tests aligned to that skill.

6. Run `dbt test` and iterate.

**Team template (~3–5 min):** Open `.cursor/skills/dbt-redshift-bi/SKILL.md`. **Say:** *This is what you commit when internal standards must win over generic internet skills.*

**Debrief:** Public skills bootstrap consistency; team skills encode **your** warehouse and review norms.

---

### Part 3 — MCP

Pick **one** track for the entire room.

**Discover (facilitator leads):** Where your org lists approved MCPs (Cursor settings, internal wiki); optional browsing [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers).

**Selection criteria (state aloud):** Read-only or low-risk; no secrets in repo; VPN/VPC rules if hitting Redshift.

**Track A — No live Redshift (easiest):**  
- Example: **Postgres** MCP against local Docker with the same data as tables, or **filesystem** / **fetch** / **docs** MCP if databases are not allowed.  
- **Apply:** Prompt must use tool output first — e.g. list columns for a table, then confirm grain before editing `fct_orders`.

**Track B — Read-only dev Redshift:**  
- MCP or tooling that can read metadata on a **read-only** dev cluster.  
- **Apply:** Confirm `order_id` vs line grain using catalog output, then adjust SQL if needed.

**Participants:**

1. Install the chosen MCP using your slide **exact name + config JSON/snippet**.
2. Run one prompt that **must** incorporate MCP output in the answer.
3. Adjust models if metadata reveals a nuance (e.g. composite grain).

**Debrief:** MCP grounds answers in *your* systems, not generic SQL.

---

### Part 4 — Hook

**Discover:** Cursor documentation for **hooks** (events vary by version). Pick **one** event the room can rely on.

**Examples that work well in class:**

- **Before submit:** remind to attach `@schema.yml` (or `@models/marts/`) when editing marts.
- **After save / other event** (per docs): nudge to run `dbt parse` or `dbt compile`.

**Participants:**

1. Add the minimal hook configuration you standardize for the session.
2. Trigger it once with a deliberately vague prompt (no @context) and observe the correction.

**Debrief:** Hooks reduce repeated mistakes (“forgot tests”, “forgot context”).

---

### Part 5 — Capstone (~20 min)

**Task:** Add a **date dimension or date key** on the fact (e.g. `dim_date` or `order_date_key`) and document **`fct_orders` grain** in `schema.yml`.

**Must reference:**

- **Public** skill (naming + tests via `@` to installed `SKILL.md`).
- MCP (if Track B: confirm date column nulls/types from metadata).
- Hook (participants should notice the nudge if they submit a vague request).

**Success criteria:** `dbt test` passes on the new slice; YAML (or README) states grain clearly.

---

## Trainer preparation

1. Maintain **golden repo** tags or branches, e.g. `workshop-start` and `workshop-solution`, if you reset rooms between sessions.
2. **Pre-flight doc** for the cohort: Python, **Node 18+** (for `npx skills`), `dbt-duckdb`, optional Docker for Postgres MCP, VPN for Redshift MCP.
3. **Pre-vet** fallback skill package(s) and MCP + config; print **Facilitator fallback** above.
4. **Slides:** Keep deck small (e.g. 5 slides); most time is in the repo + checklist.

---

## Participant cheat sheet (optional handout)

| Tool | Use for |
|------|--------|
| **Chat** | Questions, explain errors, single-file help |
| **Composer** | New models, YAML, multi-file refactors |
| **@-mentions** | Ground truth from the repo (and from installed `SKILL.md`) |
| **Public skill** | Discover on skills.sh, install with `npx skills add … --agent cursor -y` |
| **Team skill** | Internal standards in `.cursor/skills/` (version in git) |
| **MCP** | Live systems and catalogs (pick read-only, policy-approved) |
| **Hook** | Guardrails and habits |

---

## Relation to other docs

- **`README.md`** — Participant setup (venv, `dbt`, profiles, Node for skills CLI).
- **`WORKSHOP.md`** — **Perfect-path participant runbook**: step order, every command, every Composer/Chat prompt, HTML comments for “why”; includes golden-path skill install and MCP/hook steps aligned with committed `.cursor/mcp.json` and `.cursor/hooks.json`.
- **`docs/superpowers/specs/2026-03-31-workshop-plan-design.md`** — Approved design for this plan.

This file (**`instructor-doc.md`**) is the full facilitator plan and timing.
