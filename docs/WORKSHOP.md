# Cursor BI Workshop (≈2 hours)

Audience: BI analysts using **dbt** and **Redshift**. Local execution uses **DuckDB** (see `README.md`).

**Full facilitator script:** `docs/instructor-doc.md`

## Agenda

1. **Cursor basics** (15m): Chat vs Composer, `@` file/folder context, terminal.
2. **dbt + seeds** (25m): Generate staging from `seeds/` with grounded prompts (no public skill yet).
3. **Public Skill** (20m): Search [skills.sh](https://skills.sh/) or run `npx skills find dbt` → evaluate → `npx skills add … --skill … --agent cursor -y` → build marts with `@` to the installed `SKILL.md`. Briefly show `.cursor/skills/dbt-redshift-bi/` as a **team template**.
4. **MCP** (25m): Discover an approved server → install → one prompt that **requires** tool output (catalog/docs).
5. **Hook** (15m): From Cursor hooks docs → install one guardrail → trigger with a vague prompt.
6. **Capstone + Q&A** (20m): Date key / `dim_date` + grain in `schema.yml` using public skill + MCP + hook.

## Before Block 3 (skills)

Requires **Node.js** and network. Non-interactive install pattern:

```bash
npx --yes skills add <package-or-github-url> --skill <skill-name> --agent cursor -y
```

Replace `<skill-name>` with the package’s actual skill id. After install, confirm the path to `SKILL.md` (often under `.agents/skills/<skill-name>/`).

## Sample Composer prompts

**Staging (Part 1 — before public skill):**

> Using `@seeds/raw_orders.csv` `@seeds/raw_customers.csv` `@seeds/raw_products.csv` and `@dbt_project.yml`, create staging models `stg_orders`, `stg_customers`, `stg_products` under `models/staging/`. Use explicit casts and snake_case. Only columns present in the CSVs.

**Marts (Part 2 — with installed public skill):**

> Follow `@.agents/skills/<skill-name>/SKILL.md` *(adjust path to your install)*. Build `dim_customer`, `dim_product`, and `fct_orders` at **order line** grain from staging. Add `models/marts/schema.yml` with descriptions and tests aligned to that skill.

**Team template (facilitator demo, not primary exercise):**

> Compare: this repo’s `@.cursor/skills/dbt-redshift-bi/SKILL.md` is an example of a **team-authored** standard you keep in git.

## Facilitator notes

- **Fallback:** If discovery is blocked, hand out a pre-vetted `npx skills add …` line (see `docs/instructor-doc.md`).
- Keep **one** MCP choice for the room; publish exact config on a slide.
- Tag `workshop-solution` in git if you maintain a reference branch.
