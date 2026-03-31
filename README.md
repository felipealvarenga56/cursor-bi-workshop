# Workshop Cursor BI

Material prático para analistas de BI: modelagem com **dbt** no **Cursor** (skills, MCP, hooks). O SQL mira **Redshift** em produção; localmente usamos **DuckDB** para rodar o `dbt` sem warehouse.

**Repositório:** [https://github.com/felipealvarenga56/cursor-bi-workshop](https://github.com/felipealvarenga56/cursor-bi-workshop)

## Pré-requisitos

- Python 3.10+
- [Cursor](https://cursor.com/)
- Git
- **Node.js 18+** — necessário no bloco de **skill pública** (`npx skills find` / `npx skills add`)

## Início rápido

```bash
python -m venv .venv
.venv\Scripts\activate
pip install dbt-duckdb
copy profiles.yml.example %USERPROFILE%\.dbt\profiles.yml
```

Edite `%USERPROFILE%\.dbt\profiles.yml` se precisar (caminhos relativos à sua máquina). Na raiz do repositório:

```bash
dbt debug
dbt deps
dbt seed
dbt run
dbt test
```

## Estrutura do repositório

| Caminho | Finalidade |
|---------|------------|
| `seeds/` | Extrações brutas simuladas (CSV) |
| `models/` | Staging e marts (vocês criam no workshop) |
| `.cursor/skills/dbt-redshift-bi/` | Skill de **template de time** (exemplo de norma interna — não é a skill principal do hands-on) |
| `docs/WORKSHOP.md` | **Roteiro do participante** (passos ordenados, comandos, prompts literais) — **pt-BR** |
| `docs/instructor-doc.md` | Script completo do facilitador — **pt-BR** |
| `.cursor/mcp.json` | Exemplo de MCP **filesystem** no repositório (`workshop-files`) |
| `.cursor/hooks.json` + `.cursor/hooks/workshop-before-submit.cjs` | Exemplo de hook **beforeSubmitPrompt** (pede `@` em prompts de mart/dbt) |
| `facilitator/reference_solution/` | **Só facilitador:** SQL + `schema.yml` para validar o dbt (copiar para `models/`; ver README lá) |
| `.agents/skills/brainstorming/` | Skill de terceiros de [obra/superpowers](https://github.com/obra/superpowers) (opcional) |
| `skills-lock.json` | Lockfile ao usar a [CLI `skills`](https://skills.sh/) |

### Skills públicas (workshop)

1. Busque em [skills.sh](https://skills.sh/) ou rode `npx skills find dbt` (tente também `sql`, `analytics`).
2. Instale de forma não interativa no Cursor:

```bash
npx --yes skills add <pacote-ou-url-github> --skill <nome-da-skill> --agent cursor -y
```

3. No Composer, faça `@` na `SKILL.md` instalada (o caminho aparece na saída da CLI; muitas vezes `.agents/skills/<nome-da-skill>/`).

### Opcional: reinstalar a skill brainstorming

```bash
npx --yes skills add https://github.com/obra/superpowers --skill brainstorming --agent cursor -y
```

## Duração do workshop

Cerca de **2 horas** — veja `docs/WORKSHOP.md` e `docs/instructor-doc.md`.
