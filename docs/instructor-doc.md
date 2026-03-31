# Cursor BI Workshop — Instructor document

**Audience:** Business intelligence analysts who model data and build facts and dimensions with **dbt** and **Redshift**.  
**Duration:** ~2 hours.  
**Repo materials:** This repository (`seeds/`, dbt project, example Skill under `.cursor/skills/`).

---

## Learning outcomes (state these at the start)

By the end, participants should be able to:

1. Use **Chat**, **Composer**, and **@-mentions** (files, folders, docs) for dbt work.
2. Install and use a **Skill** so the AI follows team modeling standards consistently.
3. Connect **one MCP** so answers can be grounded in real structure (schemas, tables, or internal docs).
4. Enable a **Hook** so a simple guardrail runs automatically (e.g. naming, docs, or context reminders).
5. Apply all of the above on a small simulated mart: one fact + two dimensions + tests.

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
| **B. Hands-on: dbt from seeds** | 25 min | Open project, `dbt seed`, generate staging in Composer with @seeds + @dbt_project. |
| **C. First Skill** | 20 min | Use the project Skill (`dbt-redshift-bi`). Regenerate or extend a model and compare quality. |
| **D. First MCP** | 25 min | Install **one** MCP (choose one track for the whole room). Re-run a prompt that uses catalog or docs. |
| **E. First Hook** | 15 min | Add a small hook (e.g. pre-submit reminder or post-edit nudge). One guided exercise. |
| **F. Capstone + Q&A** | 20 min | Full slice: e.g. add date key / `dim_date` + document grain in `schema.yml` using skill + MCP + hook awareness. |

**Buffer:** If installs are slow, shorten the capstone and keep Q&A.

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

### Part 1 — Baseline (no Skill emphasis yet)

**Say:** *We only attach context that exists on disk.*

**Participants:**

1. Clone/open this repo in Cursor.
2. Terminal: `dbt debug` → `dbt deps` → `dbt seed`.
3. **Composer prompt (example):**

   > Using `@seeds/raw_orders.csv` `@seeds/raw_customers.csv` `@seeds/raw_products.csv` and `@dbt_project.yml`, create staging models `stg_orders`, `stg_customers`, `stg_products` in `models/staging/`. Use Redshift-friendly types, explicit casts, and snake_case. Do not invent columns beyond the CSVs.

4. Run `dbt run -s path:models/staging` (or equivalent selection) and fix failures in Chat by @-mentioning the failing file and the error text.

**Debrief:** Quality improves when seeds and project config are in context.

---

### Part 2 — First Skill

**Goal:** Encode standards once (grain, keys, naming, minimum tests).

**Participants:**

1. Open `.cursor/skills/dbt-redshift-bi/SKILL.md` and ensure Cursor picks up the skill (per current Cursor UI: Skills / project skills).
2. **Composer prompt (example):**

   > Follow `@.cursor/skills/dbt-redshift-bi/SKILL.md`. Build `dim_customer`, `dim_product`, and `fct_orders` at line grain from staging. Add `schema.yml` with descriptions and the tests required by the skill.

3. Run `dbt test` and iterate.

**Debrief:** Skills scale the team’s review checklist.

---

### Part 3 — First MCP

Pick **one** track for the entire room.

**Track A — No live Redshift (easiest):**  
- Example: **Postgres** MCP against local Docker with the same data as tables, or a **docs / filesystem** MCP if databases are not allowed.  
- Prompt idea: list columns for a “raw” table and confirm grain before writing `fct_orders`.

**Track B — Read-only dev Redshift:**  
- MCP or tooling that can read **information_schema** (or equivalent) on a **read-only** dev cluster.  
- Prompt idea: confirm whether `order_id` is unique at line grain using warehouse metadata.

**Participants:**

1. Install the chosen MCP from Cursor settings (provide exact name + config snippet in your slide deck).
2. Run one prompt that **must** incorporate MCP output (e.g. column list) in the answer.
3. Adjust the fact model if metadata reveals a nuance (e.g. composite grain).

**Debrief:** MCP grounds answers in *your* systems, not generic SQL.

---

### Part 4 — First Hook

**Examples that work well in class:**

- **Before submit:** remind to attach `@schema.yml` when editing marts.
- **After save / other event** (per Cursor version): nudge to run `dbt parse` or similar.

**Participants:**

1. Add the minimal hook configuration you standardize for the session.
2. Trigger it once with a deliberately vague prompt (no @context) and observe the correction.

**Debrief:** Hooks reduce repeated mistakes (“forgot tests”, “forgot context”).

---

### Part 5 — Capstone (~20 min)

**Task:** Add a **date dimension or date key** on the fact (e.g. `dim_date` or `order_date_key`) and document **`fct_orders` grain** in `schema.yml`.

**Must reference:**

- Skill (naming + tests).
- MCP (if Track B: confirm date column nulls/types).
- Hook (participants should notice the nudge if they submit a vague request).

**Success criteria:** `dbt test` passes on the new slice; short README or YAML description states grain clearly.

---

## Trainer preparation

1. Maintain **golden repo** tags or branches, e.g. `workshop-start` and `workshop-solution`, if you reset rooms between sessions.
2. **Pre-flight doc** for the cohort: Python version, `dbt-duckdb`, optional Docker for Postgres MCP, VPN for Redshift MCP.
3. **Fallback:** If MCP install is blocked org-wide, demo MCP from the facilitator machine and keep participants on CSV-only prompts for Part 3.
4. **Slides:** Keep deck small (e.g. 5 slides); most time is in the repo + checklist.

---

## Participant cheat sheet (optional handout)

| Tool | Use for |
|------|--------|
| **Chat** | Questions, explain errors, single-file help |
| **Composer** | New models, YAML, multi-file refactors |
| **@-mentions** | Ground truth from the repo |
| **Skill** | Team standards and workflows |
| **MCP** | Live systems and catalogs |
| **Hook** | Guardrails and habits |

---

## Relation to other docs

- **`README.md`** — Participant setup (venv, `dbt`, profiles, `seed` / `run` / `test`).
- **`WORKSHOP.md`** — Short agenda and copy-paste Composer prompts.

This file (**`instructor-doc.md`**) is the full facilitator plan and timing.
