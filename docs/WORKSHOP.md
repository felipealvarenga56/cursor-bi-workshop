# Workshop Cursor BI — roteiro passo a passo (“perfect path”)

Este arquivo é o **roteiro do participante**: execute cada etapa **na ordem**. Os comentários explicam *por que* cada passo existe.

**Script do facilitador (tempos, planos B, debriefs):** `docs/instructor-doc.md`

**Premissas:** você clonou [cursor-bi-workshop](https://github.com/felipealvarenga56/cursor-bi-workshop), está na **raiz do repositório** no terminal e, onde os caminhos diferem, usamos **Windows** (`%USERPROFILE%`). No macOS/Linux, use `~/.dbt/profiles.yml` e `cp` em vez de `copy`.

---

## Passo 0 — Abrir o projeto corretamente

1. **Arquivo → Abrir pasta** e selecione a **raiz do repo** (a pasta que contém `dbt_project.yml`).
2. Quando o Cursor perguntar, marque a pasta como **workspace confiável** se quiser que os **hooks do projeto** (Passo 14) rodem.  
   <!-- Hooks em `.cursor/hooks.json` só rodam em workspaces confiáveis; veja [documentação de hooks do Cursor](https://cursor.com/docs/hooks). -->

---

## Bloco A — Mapa do Cursor (~15 min, principalmente exploração)

Faça uma vez para o restante do workshop fluir:

| Passo | Ação | Comentário |
|------|--------|------------|
| A1 | Abra o **Chat** (chat com agente). | Perguntas, correções em um arquivo. |
| A2 | Abra o **Composer** (agente multi-etapa / vários arquivos). | Gerar `models/` + YAML juntos. |
| A3 | No Chat, digite `@` e escolha **`dbt_project.yml`**. | Confirma que **@-mentions** trazem arquivos reais como contexto. |
| A4 | Abra o **Terminal** integrado (`Ctrl+`` `). | Aqui você roda todos os comandos `dbt` e `npx`. |
| A5 | (Opcional) Selecione uma linha e use **Cmd/Ctrl+K** (edição inline). | Pequenos ajustes sem abrir o agente completo. |

Nenhum comando de shell no Bloco A.

---

## Bloco B — Ambiente, dbt, staging (~25 min)

### B1 — venv Python e dbt

```bash
python -m venv .venv
```

```bash
# Windows (cmd ou PowerShell):
.venv\Scripts\activate
```

```bash
pip install dbt-duckdb
```

<!-- Isola dependências; `dbt-duckdb` bate com o tipo de profile deste repo. -->

### B2 — Profile dbt (uma vez)

```bash
# Windows: garanta que a pasta existe e copie
mkdir %USERPROFILE%\.dbt 2>nul
copy profiles.yml.example %USERPROFILE%\.dbt\profiles.yml
```

<!-- Faça merge manual se você já tiver um `profiles.yml` global. O nome do profile deve continuar `cursor_bi_workshop` para bater com `dbt_project.yml`. -->

Abra `%USERPROFILE%\.dbt\profiles.yml` e confira se o `path` do DuckDB aponta para um arquivo gravável (o padrão `./workshop.duckdb` é relativo ao **diretório de onde você roda o `dbt`** — permaneça na raiz do repo).

### B3 — Pacotes dbt e seeds

```bash
dbt debug
```

```bash
dbt deps
```

```bash
dbt seed
```

<!-- `deps` baixa o `dbt_utils` do `packages.yml`. `seed` carrega os CSVs no DuckDB. -->

### B4 — Composer: criar modelos de staging

1. Abra o **Composer**.
2. Anexe contexto com `@` (escolha no seletor):  
   `seeds/raw_orders.csv`, `seeds/raw_customers.csv`, `seeds/raw_products.csv`, `dbt_project.yml`
3. Cole o prompt abaixo **literalmente**:

```text
Usando @seeds/raw_orders.csv @seeds/raw_customers.csv @seeds/raw_products.csv e @dbt_project.yml, crie os modelos de staging stg_orders, stg_customers e stg_products em models/staging/. Use tipos compatíveis com Redshift, casts explícitos e snake_case. Não invente colunas além das que existem nos CSVs. Leia os seeds com {{ ref('raw_orders') }}, {{ ref('raw_customers') }} e {{ ref('raw_products') }} (os nomes dos seeds no dbt coincidem com o nome do arquivo CSV, sem a extensão .csv).
```

4. Aplique os arquivos gerados; em seguida rode:

```bash
dbt run -s path:models/staging
```

<!-- Se sua versão do dbt rejeitar seletores por path: `dbt run -s stg_orders stg_customers stg_products` depois que os modelos existirem. -->

### B5 — Corrigir erros no Chat (se houver)

1. Abra o **Chat**.
2. Faça `@` no arquivo do modelo que falhou e cole o **erro do terminal** após o `dbt run`.
3. Aplique a correção e rode de novo:

```bash
dbt run -s path:models/staging
```

<!-- Ensina o ciclo “erro + @arquivo” que analistas usam no dia a dia. -->

---

## Bloco C — Skill pública: descobrir, instalar, marts (~20 min)

### C1 — Descobrir (escolha um caminho)

**Caminho 1 — busca na CLI**

```bash
npx skills find dbt
```

<!-- Tente `sql` ou `analytics` se `dbt` retornar poucos resultados. -->

**Caminho 2 — navegador**  
Abra [skills.sh](https://skills.sh/) e busque por `dbt`.

Escolha **uma** skill que o facilitador aprovar (ou use o **caminho de ouro** no C2).

### C2 — Instalar (caminho de ouro — skill oficial dbt Labs)

Use **exatamente** este comando para a CLI não travar no seletor de agentes:

```bash
npx --yes skills add https://github.com/dbt-labs/dbt-agent-skills --skill using-dbt-for-analytics-engineering --agent cursor -y
```

<!-- `--agent cursor -y` = instalação não interativa para o Cursor. Fonte: [using-dbt-for-analytics-engineering](https://skills.sh/dbt-labs/dbt-agent-skills/using-dbt-for-analytics-engineering). Se a organização bloquear o GitHub, use a URL de fallback do facilitador. -->

### C3 — Confirmar onde a skill foi parar

Liste a pasta (Windows):

```bash
dir .agents\skills
```

Você deve ver `using-dbt-for-analytics-engineering\SKILL.md` (ou a pasta da skill que escolheu).  
<!-- A CLI `skills` costuma copiar skills para `.agents/skills/<nome-da-skill>/`. -->

### C4 — Composer: montar os marts com a skill pública

1. Abra o **Composer**.
2. Faça `@` em **`.agents/skills/using-dbt-for-analytics-engineering/SKILL.md`** (ajuste se instalou outra skill), na pasta **`models/staging/`** e em **`dbt_project.yml`**.
3. Cole **literalmente**:

```text
Siga @.agents/skills/using-dbt-for-analytics-engineering/SKILL.md. Com os modelos de staging em @models/staging e @dbt_project.yml, construa dim_customer, dim_product e fct_orders com granularidade de linha de pedido (chave de grão: order_line_id). Crie models/marts/schema.yml com descrições de colunas e testes (unique/not_null nas chaves das dimensões, relationships de fct_orders para as dimensões). Use dbt_utils.generate_surrogate_key onde fizer sentido para as chaves das dimensões.
```

4. Rode:

```bash
dbt run -s path:models/marts
```

```bash
dbt test -s path:models/marts
```

<!-- Se falhar path: `dbt run -s dim_customer dim_product fct_orders`. -->

### C5 — Contraste com skill de time (~2 min)

No Chat ou Composer, faça `@` em **`.cursor/skills/dbt-redshift-bi/SKILL.md`** e leia.  
<!-- Não é o exercício principal; mostra como o time versiona **padrões internos** junto do repo. -->

---

## Bloco D — MCP: filesystem no repositório (~25 min)

Este repo traz **`.cursor/mcp.json`** com o [MCP filesystem](https://github.com/modelcontextprotocol/servers) limitado a `${workspaceFolder}`.

### D1 — Recarregar o MCP

1. Abra **Cursor Settings → MCP** (ou Features → Model Context Protocol).
2. Confira se **`workshop-files`** aparece; desligue/ligue ou reinicie o Cursor se não aparecer.  
3. Veja **Output → MCP Logs** se o servidor não subir.  
<!-- Na primeira vez o `npx` baixa `@modelcontextprotocol/server-filesystem`; permita rede. -->

### D2 — Prompt que *força* uso de ferramenta

Abra **Composer** ou **Chat** (modo agente). Cole **literalmente** (aprove a chamada de ferramenta quando o Cursor pedir):

```text
Use as ferramentas do MCP workshop-files (filesystem) para ler as primeiras 5 linhas de seeds/raw_orders.csv. Liste os nomes das colunas que você viu. Não invente nomes de coluna de memória.
```

<!-- Sucesso = a resposta cita o conteúdo do arquivo, não um CSV genérico. -->

### D3 — Follow-up opcional (ainda ancorado)

```text
Com a mesma leitura via MCP de seeds/raw_orders.csv, confira se order_line_id é único no seed e se order_id se repete entre linhas. Depois explique como isso afeta o grão de fct_orders.
```

---

## Bloco E — Hook: antes de enviar (~15 min)

Este repo traz **`.cursor/hooks.json`** e **`.cursor/hooks/workshop-before-submit.cjs`**.

### E1 — Confiança + recarregar

1. O workspace precisa ser **confiável** (Passo 0).
2. Salve `hooks.json` ou reinicie o Cursor se os hooks não rodarem.  
<!-- [Documentação de hooks](https://cursor.com/docs/hooks) -->

### E2 — Prompt que deve ser **bloqueado**

No **Composer**, cole **sem** nenhum `@`:

```text
Adicione testes not_null em fct_orders no mart.
```

**Esperado:** o envio é **bloqueado** com uma mensagem pedindo @-mention em arquivos.  
<!-- O hook só bloqueia quando o prompt parece pedido de mart/dbt e não tem `@` nem anexos de arquivo. -->

### E3 — Mesma intenção, permitido

```text
@models/marts/schema.yml Adicione testes not_null em fct_orders.order_line_id e fct_orders.customer_key se ainda não existirem.
```

**Esperado:** o prompt **envia**; aplique as mudanças; depois:

```bash
dbt test -s path:models/marts
```

---

## Bloco F — Capstone (~20 min)

### F1 — Composer (skill + @; satisfaz o hook)

Faça `@` na `SKILL.md` instalada, em `@models/marts/fct_orders.sql` (ou o caminho gerado), `@models/marts/schema.yml` e `@seeds/raw_orders.csv`.

Cole **literalmente**:

```text
Seguindo @.agents/skills/using-dbt-for-analytics-engineering/SKILL.md: adicione uma order_date_key em fct_orders (inteiro yyyymmdd ou surrogate de data fazendo join com um dim_date mínimo a partir das datas distintas de pedido no fato). Atualize @models/marts/schema.yml com uma frase descrevendo o grão de fct_orders (uma linha por ___). Mantenha os testes passando.
```

<!-- Ajuste o caminho da skill se não usou a dbt Labs. -->

### F2 — Verificar

```bash
dbt run -s path:models/marts
```

```bash
dbt test -s path:models/marts
```

---

## Referência rápida — comandos na ordem

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

## Notas para o facilitador (curtas)

- Se seletores `path:` falharem em dbt antigo, use seleção por nome (`dbt run -s stg_orders`).
- Se o MCP for bloqueado, use o plano B do `instructor-doc` / demo no notebook do instrutor.
- Skill opcional do repo: `npx --yes skills add https://github.com/obra/superpowers --skill brainstorming --agent cursor -y` (não obrigatória para o lab de mart).
