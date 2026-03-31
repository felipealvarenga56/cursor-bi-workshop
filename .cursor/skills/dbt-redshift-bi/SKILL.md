---
name: dbt-redshift-bi
description: dbt modeling standards for BI marts on Redshift (dimensions, facts, tests, naming).
---

# dbt + Redshift BI standards

## Naming

- Staging views: `stg_<source>_<entity>` (e.g. `stg_shopify_orders`).
- Dimensions: `dim_<entity>`; facts: `fct_<process>`.
- Columns: `snake_case`. Booleans: `is_` / `has_` prefix.

## Grain

- State the grain in the model YAML `description` (one row per …).
- Facts must not mix grains. Surrogate keys for dimensions: use `dbt_utils.generate_surrogate_key` on the business key column(s).

## Redshift-oriented SQL

- Prefer explicit `cast(... as ...)` for types coming from seeds/staging.
- Document `distkey` / `sortkey` suggestions in YAML `meta` or descriptions when materializing as tables to Redshift (team convention).

## Tests (minimum)

- Every `dim_*`: `unique` + `not_null` on the primary surrogate key; `unique` on natural business key where applicable.
- Every `fct_*`: `not_null` on foreign keys to dimensions; `relationships` to `dim_*` keys; `unique` + `not_null` on the fact grain key (e.g. `order_line_id`).

## Documentation

- Every mart model: `schema.yml` with column descriptions for keys, amounts, and dates.
