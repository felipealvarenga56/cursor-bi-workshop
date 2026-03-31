# Workshop Cursor BI — Documento do facilitador

**Público:** analistas de BI que modelam dados e constroem fatos e dimensões com **dbt** e **Redshift**.  
**Duração:** ~2 horas.  
**Materiais do repositório:** este repo (`seeds/`, projeto dbt, skill de **template de time** em `.cursor/skills/dbt-redshift-bi/`).

**Referência de desenho:** `docs/superpowers/specs/2026-03-31-workshop-plan-design.md`

---

## Resultados de aprendizagem (diga no início)

Ao final, os participantes devem ser capazes de:

1. Usar **Chat**, **Composer** e **@-mentions** (arquivos, pastas, docs) no trabalho com dbt.
2. **Descobrir** uma skill pública ([skills.sh](https://skills.sh/), `npx skills find`), **instalar** de forma não interativa no Cursor (`npx skills add … --agent cursor -y`) e **usar** nos prompts com `@` na `SKILL.md` instalada.
3. Reconhecer uma skill **escrita pelo time** no repositório (ex.: `.cursor/skills/dbt-redshift-bi/`) como padrão para normas internas.
4. **Descobrir, instalar e usar** **um MCP** com critérios claros (somente leitura, alinhado à política) para ancorar respostas em catálogos ou docs.
5. **Descobrir, instalar e disparar** **um Hook** como guardrail de hábito (ex.: contexto ou `dbt parse`).
6. Aplicar tudo isso em um mart simulado pequeno: um fato, duas dimensões e testes.

---

## Fio narrativo (uma história só)

Use **um cenário ponta a ponta** para Skills, MCP e hooks parecerem conectados — não três demos soltas.

**Cenário:** *mart de pedidos varejo* — precisamos de **`fct_orders`** com grão de **linha de pedido**, **`dim_customer`** e **`dim_product`**, convenções orientadas a Redshift e testes dbt.

**Entradas simuladas (este repo):**

| Ativo | Finalidade |
|--------|------------|
| `seeds/raw_orders.csv`, `raw_customers.csv`, `raw_products.csv` | Datasets sintéticos (~3000 linhas de pedido, 300 clientes, 500 produtos) |
| `models/staging/`, `models/marts/` | Onde os participantes criam modelos |
| `dbt_project.yml` | Configuração do projeto |

**Entrega do workshop:** staging → `dim_*` + `fct_orders` com chaves substitutas, testes `not_null` / `unique` / `relationships` e documentação de colunas em `schema.yml`.

**Observação:** execução local usa **DuckDB** (veja `README.md`); SQL e padrões são enquadrados para **Redshift** em produção.

---

## Plano de tempo (~120 minutos)

| Bloco | Tempo | Foco |
|--------|------|--------|
| **A. Mapa do Cursor** | 15 min | Chat vs Composer, contexto (@arquivos, @pastas, Cmd/Ctrl+K), regras vs skills (visão geral). |
| **B. Mão na massa: dbt a partir dos seeds** | 25 min | Abrir projeto, `dbt seed`, gerar staging no Composer com @seeds + @dbt_project. **Ainda sem skill pública.** |
| **C. Skill pública** | 20 min | **Descobrir** (skills.sh / `npx skills find`) → **avaliar** → **instalar** → **aplicar** nos marts; depois **template de time** (`.cursor/skills/dbt-redshift-bi/`). |
| **D. MCP** | 25 min | **Descobrir** (MCP do Cursor + allowlist / [catálogo de servidores MCP](https://github.com/modelcontextprotocol/servers)) → **escolher um** para a turma → **instalar** → **aplicar** com prompt que exige saída de ferramenta. |
| **E. Hook** | 15 min | **Descobrir** (docs de hooks do Cursor na versão deles) → **instalar** um hook mínimo → **disparar** com prompt vago. |
| **F. Capstone + perguntas** | 20 min | Chave de data / `dim_date` + grão em `schema.yml` usando **skill pública** + consciência de MCP + hook. |

**Buffer:** se instalações atrasarem, encurte o capstone e mantém o Q&A.

---

## Plano B para o facilitador (imprima isto)

Se `find`, DNS ou política bloquearem a **descoberta de skill pública** na sala:

1. **Pré-avalie** um ou dois pacotes em [skills.sh](https://skills.sh/) antes da aula (palavras-chave: `dbt`, `sql`, `analytics`).
2. Distribua a linha de instalação exata, por exemplo:

   `npx --yes skills add <url-github-ou-pacote> --skill <nome-da-skill> --agent cursor -y`

3. Os participantes ainda **abrem** a `SKILL.md` instalada e fazem **@** no Composer para cumprir o resultado de aprendizagem.

Se **MCP** for bloqueado na empresa: faça demo na máquina do facilitador; os participantes usam um **prompt roteirizado** que cita a saída da sua ferramenta, ou caem para a mesma discussão de grão só com CSV + `fct_orders.sql`.

---

## Capacidades principais do Cursor para demonstrar (checklist)

1. **Composer / agente** — edições em vários arquivos (modelos novos + YAML).
2. **Edição inline (Cmd/Ctrl+K)** — pequenos ajustes em um arquivo.
3. **Disciplina de contexto** — `@models/...`, `@seeds/...`, `@dbt_project.yml` em vez de colar arquivos inteiros no chat.
4. **Terminal** — `dbt run`, `dbt test`; colar erros de volta no chat com @arquivo.
5. **Regras** (ex.: `.cursor/rules`) — restrições curtas sempre ativas vs **Skills** — playbooks mais profundos.
6. **Skills / MCP / Hooks** — repetibilidade, ferramentas, automação.

---

## Roteiro prático (facilitador + participantes)

### Parte 1 — Linha de base (ainda sem skill pública)

**Diga:** *Só anexamos contexto que existe no disco.*

**Participantes:**

1. Clonar/abrir este repo no Cursor.
2. Terminal: `dbt debug` → `dbt deps` → `dbt seed`.
3. **Prompt no Composer (exemplo):**

   > Usando `@seeds/raw_orders.csv` `@seeds/raw_customers.csv` `@seeds/raw_products.csv` e `@dbt_project.yml`, crie os modelos de staging `stg_orders`, `stg_customers` e `stg_products` em `models/staging/`. Use tipos compatíveis com Redshift, casts explícitos e snake_case. Não invente colunas além das dos CSVs. Leia os seeds com `{{ ref('raw_orders') }}`, `{{ ref('raw_customers') }}` e `{{ ref('raw_products') }}`.

4. Rodar `dbt run -s path:models/staging` (ou seleção equivalente) e corrigir falhas no Chat com @ no arquivo que quebrou + texto do erro.

**Debrief:** a qualidade melhora quando seeds e config do projeto entram no contexto.

---

### Parte 2 — Skill pública (exercício principal)

**Objetivo:** fluxo repetível **descobrir → avaliar → instalar → aplicar** para uma **skill pública**; contrastar com skill de **time** no git.

**Participantes:**

1. **Descobrir:** acesse [skills.sh](https://skills.sh/) ou rode `npx skills find dbt` (tente `sql`, `analytics` se precisar). Escolha **uma** skill que ajude modelagem dbt ou SQL analítico.
2. **Avaliar (rubrica rápida):** credibilidade do repo/mantenedor, relevância para fatos/dimensões/testes, aderência à política da empresa. Dê uma olhada na `SKILL.md` no GitHub antes de instalar.
3. **Instalar (não interativo):**

   `npx --yes skills add <origem> --skill <nome-da-skill> --agent cursor -y`

   Use o nome **exato** do `--skill` que o pacote expõe; `--agent cursor -y` evita o seletor interativo de agentes.

4. **Localizar:** encontre a `SKILL.md` instalada (muitas vezes `.agents/skills/<nome-da-skill>/` após o passo da [CLI skills](https://skills.sh/)). No Composer, faça **@** nesse arquivo explicitamente.
5. **Prompt no Composer (exemplo):**

   > Siga `@.agents/skills/<nome-da-skill>/SKILL.md` (ajuste o caminho à instalação). Construa `dim_customer`, `dim_product` e `fct_orders` com grão de **linha de pedido** a partir do staging. Adicione `models/marts/schema.yml` com descrições e testes alinhados a essa skill.

6. Rodar `dbt test` e iterar.

**Template de time (~3–5 min):** abra `.cursor/skills/dbt-redshift-bi/SKILL.md`. **Diga:** *É isso que vocês commitam quando a norma interna tem que prevalecer sobre skill genérica da internet.*

**Debrief:** skills públicas dão consistência de partida; skills de time codificam **o seu** data warehouse e revisão.

---

### Parte 3 — MCP

Escolha **uma** trilha para a turma inteira.

**Descobrir (facilitador conduz):** onde a org lista MCPs aprovados (ajustes do Cursor, wiki interna); navegação opcional em [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers).

**Critérios de seleção (diga em voz alta):** somente leitura ou baixo risco; sem segredos no repositório; payoff claro para analistas; VPN/VPC se for Redshift.

**Trilha padrão — filesystem já configurado no repo (recomendada):**  
- Use o MCP `workshop-files` deste repositório.  
- A tarefa não é “ler as primeiras linhas do CSV”; é **provar o grão** de `fct_orders` com evidência.  
- Prompt-base: ler `seeds/raw_orders.csv` e `models/marts/fct_orders.sql`, verificar se `order_line_id` é único, se `order_id` se repete e explicar por que isso implica grão de linha de pedido.  
- Follow-up: pedir uma frase curta para o `schema.yml` e qual teste dbt protege melhor esse grão.

**Trilha avançada — MCP público `dbt-mcp` (se já estiver aprovado e pronto):**  
- Use o [dbt MCP server](https://github.com/dbt-labs/dbt-mcp) da dbt Labs.  
- Mostre lineage, model health e sinais de testes para `fct_orders` / marts.  
- Prompt-base: listar pais e filhos de `fct_orders`, mostrar health/testes disponíveis e explicar por que isso é mais útil no dia a dia do que um filesystem genérico.  
- Só use esta trilha se a autenticação/setup estiverem estáveis antes da aula.

**Outras opções públicas aceitáveis (se precisar variar):**  
- **Fetch MCP** para buscar documentação dbt ao vivo e ancorar uma decisão técnica.  
- **Git MCP** para revisar o que mudou em `models/marts/` entre `workshop-start` e o estado atual.  
- Use-as apenas se reforçarem a narrativa do mart; evite demos soltas.

**Participantes:**

1. Usar o MCP escolhido com o **nome exato + snippet** fornecido pelo facilitador.
2. Rodar um prompt que **obrigatoriamente** incorpore a saída do MCP na resposta.
3. Converter a saída em uma decisão concreta de modelagem, documentação ou validação do mart.

**Fallback em sala:** se o MCP não subir para todos, faça a chamada na máquina do facilitador, projete a saída e peça para a turma continuar a partir dessa evidência compartilhada. Se nem isso funcionar, façam a mesma análise manual sobre `raw_orders.csv` + `fct_orders.sql`; a aprendizagem continua sendo “decidir com evidência”, só sem a camada MCP.

**Debrief:** MCP ancora respostas nos **seus** sistemas e metadados; o valor real aparece quando ele muda ou valida uma decisão de modelagem.

---

### Parte 4 — Hook

**Descobrir:** documentação de **hooks** do Cursor (eventos variam por versão). Escolha **um** evento em que a turma possa confiar.

**Exemplos que funcionam bem em aula:**

- **Antes de enviar:** lembrar de anexar `@schema.yml` (ou `@models/marts/`) ao editar marts.
- **Depois de salvar / outro evento** (conforme a doc): sugerir `dbt parse` ou `dbt compile`.

**Participantes:**

1. Adicionar a configuração mínima de hook que você padronizar para a sessão.
2. Disparar uma vez com prompt deliberadamente vago (sem @contexto) e observar a correção.

**Debrief:** hooks reduzem erros repetidos (“esqueci teste”, “esqueci contexto”).

---

### Parte 5 — Capstone (~20 min)

**Tarefa:** adicionar **dimensão de data ou chave de data** no fato (ex.: `dim_date` ou `order_date_key`) e documentar o **grão de `fct_orders`** em `schema.yml`.

**Deve referenciar:**

- **Skill pública** (nomenclatura + testes via `@` na `SKILL.md` instalada).
- MCP (se Trilha B: confirmar nulos/tipos da coluna de data com metadados).
- Hook (participantes devem notar o empurrão se mandarem pedido vago).

**Critério de sucesso:** `dbt test` passa no slice novo; YAML (ou README) deixa o grão explícito.

---

## Preparação do facilitador

1. **Branches no Git:** `workshop-start` = mesmo estado de `models/` que o participante no início (só `.gitkeep`). `workshop-complete` = staging + marts já preenchidos (solução de referência) para validar `dbt` ou demonstrar o resultado. Ver `README.md`. Opcional: tags se preferir em vez de branch fixo.
2. **Solução de referência:** `facilitator/reference_solution/` tem um conjunto **staging + marts + `schema.yml`** que passa no DuckDB. Copie para `models/` para validar `dbt run` / `dbt test` antes da aula; remova esses arquivos ao ensaiar o caminho “participante do zero” (veja `facilitator/reference_solution/README.md`).
3. **Pré-voo da turma:** Python, **Node 18+** (para `npx skills`), `dbt-duckdb`, Docker opcional para MCP Postgres, VPN para MCP Redshift.
4. **Pré-avaliar** pacote(s) de skill de fallback e MCP + config; imprima o **Plano B** acima.
5. **Slides:** poucos (ex.: 5); o grosso é o repo + checklist.

---

## Folha de apoio do participante (opcional)

| Ferramenta | Uso |
|------------|-----|
| **Chat** | Dúvidas, explicar erros, ajuda em um arquivo |
| **Composer** | Modelos novos, YAML, refatorações em vários arquivos |
| **@-mentions** | Verdade do repo (e da `SKILL.md` instalada) |
| **Skill pública** | Descobrir no skills.sh, instalar com `npx skills add … --agent cursor -y` |
| **Skill de time** | Normas internas em `.cursor/skills/` (versionadas no git) |
| **MCP** | Sistemas e catálogos ao vivo (escolha read-only e aprovado pela política) |
| **Hook** | Guardrails e hábitos |

---

## Relação com outros documentos

- **`README.md`** — Configuração do participante (venv, `dbt`, profiles, Node para a CLI skills).
- **`WORKSHOP.md`** — **Roteiro passo a passo do participante**: ordem dos passos, cada comando, cada prompt do Composer/Chat; comentários `<!-- por quê -->`; inclui instalação da skill “caminho de ouro” e passos MCP/hook alinhados a `.cursor/mcp.json` e `.cursor/hooks.json`.
- **`docs/superpowers/specs/2026-03-31-workshop-plan-design.md`** — Desenho aprovado deste plano.

Este arquivo (**`instructor-doc.md`**) é o plano completo do facilitador e o cronograma.
