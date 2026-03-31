# Reference solution (facilitators only)

These files are a **working end state** for Blocks B–C (staging + marts + tests) so you can:

- Sanity-check `dbt run` / `dbt test` before a session.
- Recover a room if generation goes wrong (copy into `models/staging/` and `models/marts/`).

**Do not** ship this to participants as the default `models/` layout if you want them to generate SQL in Cursor; keep copies only here or on a `workshop-solution` branch.

## How to validate locally

From repo root (after `dbt seed`):

1. Copy `staging/*.sql` → `models/staging/`
2. Copy `marts/*.sql` and `marts/schema.yml` → `models/marts/`
3. Run:

```bash
dbt run -s path:models/staging path:models/marts
dbt test -s path:models/marts
```

Remove or rename these copies when rehearsing the blank “participant” path.
