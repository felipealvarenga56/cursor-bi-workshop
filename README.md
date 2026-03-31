# Cursor BI Workshop

Hands-on materials for BI analysts: **dbt** modeling with **Cursor** (skills, MCP, hooks). SQL targets **Redshift** in production; local runs use **DuckDB** so you can execute `dbt` without a warehouse.

**Repository:** [https://github.com/felipealvarenga56/cursor-bi-workshop](https://github.com/felipealvarenga56/cursor-bi-workshop)

## Prerequisites

- Python 3.10+
- [Cursor](https://cursor.com/)
- Git
- **Node.js 18+** — required for the workshop **public skill** block (`npx skills find` / `npx skills add`)

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
dbt deps
dbt seed
dbt run
dbt test
```

## Repo layout

| Path | Purpose |
|------|--------|
| `seeds/` | Simulated raw extracts (CSV) |
| `models/` | Staging and marts (you build these in the workshop) |
| `.cursor/skills/dbt-redshift-bi/` | **Team-template** skill (internal standards example — not the main hands-on skill) |
| `docs/WORKSHOP.md` | Short agenda and prompts |
| `docs/instructor-doc.md` | Full facilitator script |
| `.agents/skills/brainstorming/` | Example third-party skill from [obra/superpowers](https://github.com/obra/superpowers) (optional) |
| `skills-lock.json` | Lockfile when you use the [`skills` CLI](https://skills.sh/) |

### Public skills (workshop)

1. Search on [skills.sh](https://skills.sh/) or run `npx skills find dbt` (try `sql`, `analytics` too).
2. Install non-interactively for Cursor:

```bash
npx --yes skills add <package-or-github-url> --skill <skill-name> --agent cursor -y
```

3. In Composer, `@`-mention the installed `SKILL.md` (path is printed by the CLI; often `.agents/skills/<skill-name>/`).

### Optional: (re)install brainstorming skill

```bash
npx --yes skills add https://github.com/obra/superpowers --skill brainstorming --agent cursor -y
```

## Workshop duration

About **2 hours** — see `docs/WORKSHOP.md` and `docs/instructor-doc.md`.
