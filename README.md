# Cursor BI Workshop

Hands-on materials for BI analysts: **dbt** modeling with **Cursor** (skills, MCP, hooks). SQL targets **Redshift** in production; local runs use **DuckDB** so you can execute `dbt` without a warehouse.

**Repository:** [https://github.com/felipealvarenga56/cursor-bi-workshop](https://github.com/felvarenga56/cursor-bi-workshop)

## Prerequisites

- Python 3.10+
- [Cursor](https://cursor.com/)
- Git
- Node.js 18+ (only if you (re)install skills via `npx skills`)

## Quick start

```bash
python -m venv .venv
.venv\Scripts\activate
pip install dbt-duckdb
copy profiles.yml.example %USERPROFILE%\.dbt\profiles.yml
```

Edit `%USERPROFILE%\.dbt\profiles.yml` if needed (paths are relative to your machine). From the repo root:

```bash
dbt debug
dbt seed
dbt run
dbt test
```

## Repo layout

| Path | Purpose |
|------|--------|
| `seeds/` | Simulated raw extracts (CSV) |
| `models/` | Staging and marts (you build these in the workshop) |
| `.cursor/skills/dbt-redshift-bi/` | Example **Skill** for modeling standards |
| `docs/WORKSHOP.md` | Facilitator / participant outline |
| `.agents/skills/brainstorming/` | Third-party skill from [obra/superpowers](https://github.com/obra/superpowers) (see below) |
| `skills-lock.json` | Lockfile for skills installed with the [`skills` CLI](https://skills.sh/) |

### Optional: (re)install brainstorming skill

From the repo root (non-interactive):

```bash
npx --yes skills add https://github.com/obra/superpowers --skill brainstorming --agent cursor -y
```

## Workshop duration

About **2 hours** — see `docs/WORKSHOP.md`.
