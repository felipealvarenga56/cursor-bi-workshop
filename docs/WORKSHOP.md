# Cursor BI Workshop (≈2 hours)

Audience: BI analysts using **dbt** and **Redshift**. Local execution uses **DuckDB** (see `README.md`).

## Agenda

1. **Cursor basics** (15m): Chat vs Composer, `@` file/folder context, terminal.
2. **dbt + seeds** (25m): Generate staging models from `seeds/` with grounded prompts.
3. **First Skill** (20m): Use `.cursor/skills/dbt-redshift-bi/SKILL.md` for marts + tests.
4. **First MCP** (25m): Install one MCP (e.g. DB or docs); verify grounded answers.
5. **First Hook** (15m): Add a small automation (e.g. submit guardrail).
6. **Capstone + Q&A** (20m): `dim_date` or date key + `schema.yml` documentation.

## Sample Composer prompts

**Staging (before Skill):**

> Using `@seeds/raw_orders.csv` `@seeds/raw_customers.csv` `@seeds/raw_products.csv` and `@dbt_project.yml`, create staging models `stg_orders`, `stg_customers`, `stg_products` under `models/staging/`. Use explicit casts and snake_case. Only columns present in the CSVs.

**Marts (with Skill):**

> Follow `@.cursor/skills/dbt-redshift-bi/SKILL.md`. Build `dim_customer`, `dim_product`, and `fct_orders` at **order line** grain from staging. Add `models/marts/schema.yml` with tests and column descriptions.

## Facilitator notes

- Keep **one** MCP choice for the room (Postgres/DuckDB file browser vs corporate read-only Redshift).
- Tag `workshop-solution` in git if you maintain a reference branch.
