# Cursor BI Workshop — perfect-path runbook

This file is the **participant execution script**: do each step **in order**. Comments explain *why* each step exists.

**Facilitator script (timing, fallbacks, debriefs):** `docs/instructor-doc.md`

**Assumptions:** You cloned [cursor-bi-workshop](https://github.com/felipealvarenga56/cursor-bi-workshop), you are at the **repository root** in the terminal, and you use **Windows** below where paths differ (`%USERPROFILE%`). On macOS/Linux, use `~/.dbt/profiles.yml` and `cp` instead of `copy`.

---

## Step 0 — Open the project correctly

1. **File → Open Folder** and select the **repo root** (the folder that contains `dbt_project.yml`).
2. When Cursor asks, mark the folder as a **trusted workspace** if you want **project hooks** (Step 14) to run.  
   <!-- Hooks in `.cursor/hooks.json` only run in trusted workspaces; see [Cursor hooks docs](https://cursor.com/docs/hooks). -->

---

## Block A — Cursor map (~15 min, mostly exploration)

Do these once so the rest of the workshop is fluid:

| Step | Action | Comment |
|------|--------|--------|
| A1 | Open **Chat** (agent chat). | Use for Q&A and single-file fixes. |
| A2 | Open **Composer** (multi-step / multi-file agent). | Use for generating `models/` + YAML together. |
| A3 | In Chat, type `@` and pick **`dbt_project.yml`**. | Confirms **@-mentions** attach real files as context. |
| A4 | Open the integrated **Terminal** (`Ctrl+`` `). | You will run all `dbt` and `npx` commands here. |
| A5 | (Optional) Select a line in a file and **Cmd/Ctrl+K** inline edit. | Small edits without opening full agent. |

No shell commands required for Block A.

---

## Block B — Environment, dbt, staging (~25 min)

### B1 — Python venv and dbt

```bash
python -m venv .venv
```

```bash
# Windows (cmd or PowerShell):
.venv\Scripts\activate
```

```bash
pip install dbt-duckdb
```

<!-- Isolates dependencies; `dbt-duckdb` matches this repo’s profile type. -->

### B2 — dbt profile (one-time)

```bash
# Windows: ensure folder exists, then copy
mkdir %USERPROFILE%\.dbt 2>nul
copy profiles.yml.example %USERPROFILE%\.dbt\profiles.yml
```

<!-- Merge manually if you already have a global `profiles.yml`. The profile name must stay `cursor_bi_workshop` to match `dbt_project.yml`. -->

Open `%USERPROFILE%\.dbt\profiles.yml` and confirm the DuckDB `path` points at a file you can write (default `./workshop.duckdb` is relative to **where you run `dbt`** — stay in repo root).

### B3 — Install dbt packages and load seeds

```bash
dbt debug
```

```bash
dbt deps
```

```bash
dbt seed
```

<!-- `deps` pulls `dbt_utils` from `packages.yml`. `seed` loads CSVs into DuckDB. -->

### B4 — Composer: create staging models

1. Open **Composer**.
2. Attach context with `@` (pick from the picker):  
   `seeds/raw_orders.csv`, `seeds/raw_customers.csv`, `seeds/raw_products.csv`, `dbt_project.yml`
3. Paste this prompt **verbatim**:

```text
Using @seeds/raw_orders.csv @seeds/raw_customers.csv @seeds/raw_products.csv and @dbt_project.yml, create staging models stg_orders, stg_customers, stg_products in models/staging/. Use Redshift-friendly types, explicit casts, and snake_case. Do not invent columns beyond the CSVs. Use {{ ref() }} to seeds as appropriate for this dbt version.
```

4. Apply generated files; then run:

```bash
dbt run -s path:models/staging
```

<!-- If your dbt version rejects path selectors, run: `dbt run -s stg_orders stg_customers stg_products` after models exist. -->

### B5 — Fix failures in Chat (if any)

1. Open **Chat**.
2. `@`-mention the model file that failed and paste the **terminal error** after `dbt run`.
3. Apply the fix; re-run:

```bash
dbt run -s path:models/staging
```

<!-- Teaches the “error + @file” loop BI analysts will use daily. -->

---

## Block C — Public Skill: discover, install, marts (~20 min)

### C1 — Discover (pick one path)

**Path 1 — CLI search**

```bash
npx skills find dbt
```

<!-- Try `sql` or `analytics` if `dbt` returns few results. -->

**Path 2 — Browser**  
Open [skills.sh](https://skills.sh/) and search for `dbt`.

Pick **one** skill your facilitator approves (or use the **golden path** in C2).

### C2 — Install (golden path — official dbt Labs skill)

Use this **exact** command so the CLI never blocks on the agent picker:

```bash
npx --yes skills add https://github.com/dbt-labs/dbt-agent-skills --skill using-dbt-for-analytics-engineering --agent cursor -y
```

<!-- `--agent cursor -y` = non-interactive install for Cursor. Skill source: [using-dbt-for-analytics-engineering](https://skills.sh/dbt-labs/dbt-agent-skills/using-dbt-for-analytics-engineering). If your org blocks GitHub, use the facilitator’s fallback URL. -->

### C3 — Confirm where the skill landed

List the folder (Windows):

```bash
dir .agents\skills
```

You should see `using-dbt-for-analytics-engineering\SKILL.md` (or the folder for your chosen skill).  
<!-- The `skills` CLI usually copies skills under `.agents/skills/<skill-name>/`. -->

### C4 — Composer: build marts with the public skill

1. Open **Composer**.
2. `@`-mention: **`.agents/skills/using-dbt-for-analytics-engineering/SKILL.md`** (adjust if you installed a different skill), plus **`models/staging/`** (folder) and **`dbt_project.yml`**.
3. Paste **verbatim**:

```text
Follow @.agents/skills/using-dbt-for-analytics-engineering/SKILL.md. Using staging models under @models/staging and @dbt_project.yml, build dim_customer, dim_product, and fct_orders at order-line grain (grain key: order_line_id). Add models/marts/schema.yml with column descriptions and tests (unique/not_null on dimension keys, relationships from fct_orders to dimensions). Use dbt_utils.generate_surrogate_key where appropriate for dimension keys.
```

4. Run:

```bash
dbt run -s path:models/marts
```

```bash
dbt test -s path:models/marts
```

<!-- If paths fail: `dbt run -s dim_customer dim_product fct_orders`. -->

### C5 — Team-template contrast (2 min)

In Chat or Composer, `@`-mention **`.cursor/skills/dbt-redshift-bi/SKILL.md`** and read it.  
<!-- This is **not** the main exercise; it shows how teams version **internal** standards next to the repo. -->

---

## Block D — MCP: filesystem on the repo (~25 min)

This repo ships **`.cursor/mcp.json`** with the [filesystem MCP](https://github.com/modelcontextprotocol/servers) scoped to `${workspaceFolder}`.

### D1 — Reload MCP

1. Open **Cursor Settings → MCP** (or Features → Model Context Protocol).
2. Confirm **`workshop-files`** appears; toggle **off/on** or restart Cursor if it does not.  
3. Check **Output → MCP Logs** if the server fails to start.  
<!-- `npx` downloads `@modelcontextprotocol/server-filesystem` on first use; allow network. -->

### D2 — Agent prompt that *forces* tool use

Open **Composer** or **Chat** (agent mode). Paste **verbatim** (approve the tool call when Cursor asks):

```text
Use the workshop-files MCP (filesystem) tools to read the first 5 lines of seeds/raw_orders.csv. List the column names you see. Do not guess column names from memory.
```

<!-- Success = the model’s answer quotes file content, not generic CSV guesses. -->

### D3 — Optional follow-up (still grounded)

```text
Using the same MCP read of seeds/raw_orders.csv, confirm whether order_line_id is unique in the seed file and whether order_id repeats across lines. Then say how that affects grain for fct_orders.
```

---

## Block E — Hook: before submit (~15 min)

This repo ships **`.cursor/hooks.json`** and **`.cursor/hooks/workshop-before-submit.cjs`**.

### E1 — Trust + reload

1. Workspace must be **trusted** (Step 0).
2. Save `hooks.json` or restart Cursor if hooks do not run.  
<!-- [Hooks documentation](https://cursor.com/docs/hooks) -->

### E2 — Prompt that should be **blocked**

In **Composer**, paste **without** any `@` mentions:

```text
Add not_null tests to fct_orders in the mart.
```

**Expected:** submission is **blocked** with a message about @-mentioning files.  
<!-- The hook only blocks when the prompt looks like mart/dbt work and has no `@` and no file attachments. -->

### E3 — Same intent, allowed

```text
@models/marts/schema.yml Add not_null tests on fct_orders.order_line_id and fct_orders.customer_key if missing.
```

**Expected:** prompt **sends**; apply changes; then:

```bash
dbt test -s path:models/marts
```

---

## Block F — Capstone (~20 min)

### F1 — Composer (skill + @ context; satisfies hook)

`@`-mention your installed skill `SKILL.md`, `@models/marts/fct_orders.sql` (or `.sql` path as generated), `@models/marts/schema.yml`, `@seeds/raw_orders.csv`.

Paste **verbatim**:

```text
Following @.agents/skills/using-dbt-for-analytics-engineering/SKILL.md: add an order_date_key on fct_orders (integer yyyymmdd or date surrogate joining to a minimal dim_date built from distinct order dates in the fact). Update @models/marts/schema.yml with a one-sentence grain description for fct_orders (one row per ___). Keep tests passing.
```

<!-- Adjust skill path if you did not use the dbt Labs skill. -->

### F2 — Verify

```bash
dbt run -s path:models/marts
```

```bash
dbt test -s path:models/marts
```

---

## Quick reference — commands used in order

```bash
python -m venv .venv
.venv\Scripts\activate
pip install dbt-duckdb
mkdir %USERPROFILE%\.dbt 2>nul
copy profiles.yml.example %USERPROFILE%\.dbt\profiles.yml
dbt debug
dbt deps
dbt seed
dbt run -s path:models/staging
npx skills find dbt
npx --yes skills add https://github.com/dbt-labs/dbt-agent-skills --skill using-dbt-for-analytics-engineering --agent cursor -y
dbt run -s path:models/marts
dbt test -s path:models/marts
```

---

## Facilitator notes (short)

- If `path:` selectors fail on an older dbt, switch to model-name selects (`dbt run -s stg_orders`).
- If MCP is blocked, use the instructor-doc **Track B** / demo laptop fallback.
- Optional repo skill: `npx --yes skills add https://github.com/obra/superpowers --skill brainstorming --agent cursor -y` (not required for this mart lab).
