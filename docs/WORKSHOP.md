# Workshop Cursor BI — roteiro passo a passo (“perfect path”)

Este arquivo é o **roteiro do participante**: execute cada etapa **na ordem**. Os comentários explicam *por que* cada passo existe.

**Script do facilitador (tempos, planos B, debriefs):** `docs/instructor-doc.md`

**Premissas:** você clonou [cursor-bi-workshop](https://github.com/felipealvarenga56/cursor-bi-workshop), está na **raiz do repositório** no terminal e, onde os caminhos diferem, usamos **Windows** (`%USERPROFILE%`). No macOS/Linux, use `~/.dbt/profiles.yml` e `cp` em vez de `copy`.

---

## Passo 0 — Git, branch e abrir o projeto

### 0.1 Escolher o branch (antes de abrir o Cursor)

O repositório tem branches para **recomeçar do zero** ou **ver o estado já resolvido** (somente SQL/dbt — não inclui skills instaladas via `npx`).

| Branch | Quando usar |
|--------|-------------|
| **`main`** ou **`workshop-start`** | Estado **inicial** do lab: `models/staging` e `models/marts` só com `.gitkeep`, **sem** arquivos `.sql` gerados. Use este roteiro **a partir do Bloco B** gerando tudo no Cursor. |
| **`workshop-complete`** | Staging + marts + `schema.yml` **já** em `models/` (solução de referência). Útil para **validar** `dbt seed` / `dbt run` / `dbt test` ou ver o resultado esperado **sem** refazer os blocos no Composer. **Não** use se quiser simular o participante do zero. |

**Participante seguindo este arquivo do início (recomendado):**

```bash
git checkout workshop-start
git pull origin workshop-start
```

<!-- Vai para o branch-base do workshop e sincroniza com o remoto para evitar começar com arquivos “meio prontos” ou desatualizados. -->

**Facilitador recomeçando após testes no branch completo:**

```bash
git checkout workshop-start
git reset --hard origin/workshop-start
```

<!-- Uso de facilitador: descarta testes locais e volta exatamente ao estado de referência do início do lab. -->

**Só para conferir o “fim” dos modelos base (staging + marts):**

```bash
git checkout workshop-complete
git pull origin workshop-complete
```

<!-- Atalho para inspecionar a solução final sem passar novamente pela geração dos modelos no Cursor. -->

O branch padrão no GitHub é **`main`**; para `models/`, ele está alinhado ao **`workshop-start`**.

### 0.2 Abrir o projeto no Cursor

1. **Arquivo → Abrir pasta** e selecione a **raiz do repo** (a pasta que contém `dbt_project.yml`).
2. Quando o Cursor perguntar, marque a pasta como **workspace confiável** se quiser que os **hooks do projeto** (Bloco E) rodem.  
   <!-- Hooks em `.cursor/hooks.json` só rodam em workspaces confiáveis; veja [documentação de hooks do Cursor](https://cursor.com/docs/hooks). -->

---

## Bloco A — Mapa do Cursor (~15 min, principalmente exploração)

Faça uma vez para o restante do workshop fluir:

<!-- Este bloco é de orientação: a pessoa aprende qual superfície do Cursor usar antes de misturar agente, terminal e arquivos reais no mesmo exercício. -->

| Passo | Ação | Comentário |
|------|--------|------------|
| A1 | Abra o **Chat** (chat com agente). | Perguntas, correções em um arquivo. |
| A2 | Abra o **Composer** (agente multi-etapa / vários arquivos). | Gerar `models/` + YAML juntos. |
| A3 | No Chat, digite `@` e escolha **`dbt_project.yml`**. | Confirma que **@-mentions** trazem arquivos reais como contexto. |
| A4 | Abra o **Terminal** integrado (`Ctrl+`` `). | Aqui você roda todos os comandos `dbt` e `npx`. |
| A5 | (Opcional) Selecione uma linha e use **Cmd/Ctrl+K** (edição inline). | Pequenos ajustes sem abrir o agente completo. |

Nenhum comando de shell no Bloco A.

<!-- O Bloco B é onde o dbt roda de fato; aqui começam instalação, seeds e modelos. -->

---

## Bloco B — Ambiente, dbt, staging (~25 min)

Este bloco é o **primeiro em que o lab fica executável** — instalação, profile, seeds e staging validado — e é o ponto de partida para gerar SQL no Cursor quando você usa `workshop-start` / `main` (Passo 0.1). Sem o Bloco B, não há dados materializados no DuckDB nem modelos `stg_*` testados; marts, testes, MCP e capstone ficam sem alicerce.

<!-- Resumo para facilitador: B encadeia ambiente → dados → primeira camada de modelagem. O Bloco C pressupõe staging já criado e rodando. -->

### B1 — venv Python e dbt

O venv isola dependências deste repo; `dbt-duckdb` é o adapter alinhado ao profile DuckDB deste lab. Sem este passo, não há CLI `dbt` utilizável neste projeto.

```bash
python -m venv .venv #Isolated Python env so this repo’s dbt install does not clash with other projects on the machine
```

Cria um ambiente Python isolado dentro do repo para não misturar dbt e dependências deste workshop com outras instalações da máquina.

```bash
# Windows (cmd ou PowerShell):
.venv\Scripts\activate
```

Ativa o venv; depois disso, `pip` e `dbt` passam a instalar/rodar dentro desse ambiente isolado.

```bash
pip install dbt-duckdb
```

Isola dependências; `dbt-duckdb` bate com o tipo de profile deste repo. 
Instala o adapter e o core do dbt necessários para rodar localmente contra DuckDB neste lab.

### B2 — Profile dbt (uma vez)

Odbt procura `profiles.yml` no diretório padrão do usuário (ex.: `%USERPROFILE%\.dbt` no Windows). O profile `cursor_bi_workshop` deve coincidir com `dbt_project.yml`; o `path` do DuckDB deve ser gravável e coerente com o diretório de trabalho (raiz do repo). Sem profile correto, `dbt debug` e os runs falham ou apontam para o banco errado.

No **PowerShell** (terminal padrão do Cursor no Windows), `%USERPROFILE%` e `copy` não funcionam como no CMD — use:

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.dbt"
Copy-Item profiles.yml.example "$env:USERPROFILE\.dbt\profiles.yml"
```

Cria a pasta padrão de configuração do dbt no Windows e copia um profile inicial para o local onde o dbt realmente procura esse arquivo. 

No **Prompt de comando (cmd.exe)**:

```bat
mkdir %USERPROFILE%\.dbt 2>nul
copy profiles.yml.example %USERPROFILE%\.dbt\profiles.yml
```

Mesma ideia do bloco acima, mas com sintaxe de CMD em vez de PowerShell.

Faça merge manual se você já tiver um `profiles.yml` global. O nome do profile deve continuar `cursor_bi_workshop` para bater com `dbt_project.yml`.

Abra `%USERPROFILE%\.dbt\profiles.yml` e confira se o `path` do DuckDB aponta para um arquivo gravável (o padrão `./workshop.duckdb` é relativo ao **diretório de onde você roda o `dbt`** — permaneça na raiz do repo).

### B3 — Pacotes dbt e seeds

`dbt debug` confere profile, adapter e caminho do banco antes de investir em modelos; `dbt deps` baixa pacotes de `packages.yml` (ex.: dbt_utils) para macros e testes; `dbt seed` materializa os CSVs que o staging lê via `ref()`. Ordem: debug → deps → seed.

```bash
dbt debug
```

Verifica se profile, adapter, caminho do banco e credenciais locais estão corretos antes de rodar transformações.

```bash
dbt deps
```

Baixa pacotes declarados em `packages.yml`, como `dbt_utils`, para que macros referenciadas no projeto existam localmente.

```bash
dbt seed
```

`deps` baixa o `dbt_utils` do `packages.yml`. `seed` carrega os CSVs no DuckDB.
Materializa os CSVs de `seeds/` como tabelas no DuckDB; isso cria as entradas que os modelos staging vão ler via `ref()`.

### B4 — Composer: criar modelos de staging

Primeira geração substantiva de modelos no Cursor; o staging é a fundação sobre a qual o Bloco C monta os marts (skill + `models/staging`). `dbt run` só no path de staging valida o SQL antes de avançar para marts.

1. Abra o **Composer**.
2. Anexe contexto com `@` (escolha no seletor):  
   `seeds/raw_orders.csv`, `seeds/raw_customers.csv`, `seeds/raw_products.csv`, `dbt_project.yml`
3. Cole o prompt abaixo **literalmente**:

O objetivo aqui é forçar o agente a trabalhar com a verdade do repo: dados de entrada reais + configuração real do projeto, sem inventar colunas ou nomes de refs.

```text
Usando @seeds/raw_orders.csv @seeds/raw_customers.csv @seeds/raw_products.csv e @dbt_project.yml, crie os modelos de staging stg_orders, stg_customers e stg_products em models/staging/. Use tipos compatíveis com Redshift, casts explícitos e snake_case. Não invente colunas além das que existem nos CSVs. Leia os seeds com {{ ref('raw_orders') }}, {{ ref('raw_customers') }} e {{ ref('raw_products') }} (os nomes dos seeds no dbt coincidem com o nome do arquivo CSV, sem a extensão .csv).
```

4. Aplique os arquivos gerados; em seguida rode:

```bash
dbt run -s path:models/staging
```

Compila e executa só os modelos de staging para validar rapidamente se o SQL gerado pelo agente funciona antes de avançar para os marts.

Se sua versão do dbt rejeitar seletores por path: `dbt run -s stg_orders stg_customers stg_products` depois que os modelos existirem. 

### B5 — Corrigir erros no Chat (se houver)

Reforça o ciclo “erro do terminal + @arquivo” usado no dia a dia; reexecutar o mesmo seletor isola a correção sem mudar outras partes do pipeline.

1. Abra o **Chat**.
2. Faça `@` no arquivo do modelo que falhou e cole o **erro do terminal** após o `dbt run`.
3. Aplique a correção e rode de novo:

```bash
dbt run -s path:models/staging
```

Ensina o ciclo “erro + @arquivo” que analistas usam no dia a dia.
Reexecutar o mesmo seletor confirma se a correção resolveu o problema no ponto exato onde ele apareceu, sem introduzir novas variáveis.

---

## Bloco C — Skill pública: descobrir, instalar, marts (~20 min)

### C1 — Descobrir (escolha um caminho)

**Caminho 1 — busca na CLI**

```bash
npx skills find dbt
```

<!-- Tente `sql` ou `analytics` se `dbt` retornar poucos resultados. -->
<!-- Busca skills públicas relacionadas a dbt pela CLI; é o passo de descoberta antes de instalar qualquer coisa no ambiente. -->

**Caminho 2 — navegador**  
Abra [skills.sh](https://skills.sh/) e busque por `dbt`.

Escolha **uma** skill que o facilitador aprovar (ou use o **caminho de ouro** no C2).

### C2 — Instalar (caminho de ouro — skill oficial dbt Labs)

Use **exatamente** este comando para a CLI não travar no seletor de agentes:

```bash
npx --yes skills add https://github.com/dbt-labs/dbt-agent-skills --skill using-dbt-for-analytics-engineering --agent cursor -y
```

<!-- `--agent cursor -y` = instalação não interativa para o Cursor. Fonte: [using-dbt-for-analytics-engineering](https://skills.sh/dbt-labs/dbt-agent-skills/using-dbt-for-analytics-engineering). Se a organização bloquear o GitHub, use a URL de fallback do facilitador. -->
<!-- Instala a skill pública aprovada diretamente no formato esperado pelo Cursor, sem prompts interativos durante a aula. -->

### C3 — Confirmar onde a skill foi parar

Liste a pasta (Windows):

```bash
dir .agents\skills
```

Você deve ver `using-dbt-for-analytics-engineering\SKILL.md` (ou a pasta da skill que escolheu).  
<!-- A CLI `skills` costuma copiar skills para `.agents/skills/<nome-da-skill>/`. -->
<!-- Este passo confirma onde a skill foi instalada para que a turma possa referenciar a `SKILL.md` com `@` no Composer. -->

### C4 — Composer: montar os marts com a skill pública

1. Abra o **Composer**.
2. Faça `@` em **`.agents/skills/using-dbt-for-analytics-engineering/SKILL.md`** (ajuste se instalou outra skill), na pasta **`models/staging/`** e em **`dbt_project.yml`**.
3. Cole **literalmente**:

<!-- Aqui a skill deixa de ser “teoria”: o agente recebe o playbook da skill, os modelos staging já criados e a config do projeto para produzir marts e testes coerentes. -->

```text
Siga @.agents/skills/using-dbt-for-analytics-engineering/SKILL.md. Com os modelos de staging em @models/staging e @dbt_project.yml, construa dim_customer, dim_product e fct_orders com granularidade de linha de pedido (chave de grão: order_line_id). Crie models/marts/schema.yml com descrições de colunas e testes (unique/not_null nas chaves das dimensões, relationships de fct_orders para as dimensões). Use dbt_utils.generate_surrogate_key onde fizer sentido para as chaves das dimensões.
```

4. Rode:

```bash
dbt run -s path:models/marts
```

<!-- Executa só os marts para validar joins, granularidade e chaves geradas depois que o SQL foi criado. -->

```bash
dbt test -s path:models/marts
```

<!-- Se falhar path: `dbt run -s dim_customer dim_product fct_orders`. -->
<!-- Roda os testes do mart para verificar regras de qualidade como `unique`, `not_null` e `relationships`. -->

### C5 — Contraste com skill de time (~2 min)

No Chat ou Composer, faça `@` em **`.cursor/skills/dbt-redshift-bi/SKILL.md`** e leia.  
<!-- Não é o exercício principal; mostra como o time versiona **padrões internos** junto do repo. -->
<!-- O contraste é intencional: skill pública acelera o começo, skill interna codifica convenções específicas do time e do warehouse real. -->

---

## Bloco D — MCP: validar grão com evidência (~25 min)

Este repo traz **`.cursor/mcp.json`** com o [MCP filesystem](https://github.com/modelcontextprotocol/servers) limitado a `${workspaceFolder}`. A ideia aqui não é “ler arquivo por ler”: é usar MCP para **ancorar uma decisão de modelagem** no seed real, em vez de confiar em memória ou SQL genérico.

### D1 — Recarregar o MCP

1. Abra **Cursor Settings → MCP** (ou Features → Model Context Protocol).
2. Confira se **`workshop-files`** aparece; desligue/ligue ou reinicie o Cursor se não aparecer.  
3. Veja **Output → MCP Logs** se o servidor não subir.  
<!-- Na primeira vez o `npx` baixa `@modelcontextprotocol/server-filesystem`; permita rede. -->
<!-- Antes do exercício, a turma precisa validar que o MCP está disponível; sem isso o agente não consegue chamar a ferramenta externa. -->

### D2 — Prompt principal: provar o grão com o MCP

Abra **Composer** ou **Chat** (modo agente). Cole **literalmente** (aprove a chamada de ferramenta quando o Cursor pedir):

```text
Use as ferramentas do MCP workshop-files (filesystem) para inspecionar seeds/raw_orders.csv e models/marts/fct_orders.sql. Com base no conteúdo real desses arquivos, responda: (1) quais colunas identificam o nível mais granular do seed, (2) se order_line_id parece único, (3) se order_id se repete entre linhas e (4) por que isso sugere que o grão de fct_orders deve ser uma linha por item de pedido. Não responda de memória; cite o que você observou via MCP.
```

**Esperado:** a resposta menciona observações concretas do CSV e conecta isso ao grão do fato.  
<!-- Sucesso = a resposta usa a ferramenta para justificar uma decisão de modelagem, não só listar colunas. -->
<!-- O ponto pedagógico aqui é mostrar MCP como “evidência conectada ao trabalho”, não como um demo genérico de leitura de arquivo. -->

### D3 — Follow-up: transformar evidência em instrução útil

```text
Usando a mesma evidência lida via MCP em seeds/raw_orders.csv e models/marts/fct_orders.sql, escreva uma frase curta para a documentação de fct_orders em schema.yml explicando o grão do modelo. Depois diga qual teste dbt é o mais importante para proteger esse grão.
```

**Esperado:** o agente proponha algo como “uma linha por item de pedido” e relacione isso a `unique` / `not_null` na chave de grão (`order_line_id` ou equivalente).
<!-- Este follow-up transforma observação em artefato útil: documentação e teste, que são exatamente o que o time manteria no projeto. -->

### D4 — Opcional avançado: MCP público dbt

Se o facilitador já tiver um **MCP público aprovado** para a turma, faça esta variante em vez da D2/D3. A melhor opção para este workshop é o **`dbt-mcp`** da dbt Labs.

Prompt sugerido:

```text
Usando o dbt MCP, liste os pais e filhos de fct_orders, mostre qualquer sinal de health/teste disponível para os marts e explique em 3-5 linhas como isso ajuda a validar o desenho do mart sem depender só de leitura manual de SQL.
```

**Esperado:** a resposta use metadados/lineage do dbt para mostrar por que esse MCP é mais útil no dia a dia que um filesystem genérico.  
<!-- Use esta trilha só se a sala já tiver setup/autenticação prontos; caso contrário, fique na trilha filesystem acima. -->
<!-- Esta variante existe para mostrar um MCP com valor mais próximo da vida real: lineage, health e metadados governados do projeto dbt. -->

---

## Bloco E — Hook: antes de enviar (~15 min)

Este repo traz **`.cursor/hooks.json`** e **`.cursor/hooks/workshop-before-submit.cjs`**.

### E1 — Confiança + recarregar

1. O workspace precisa ser **confiável** (Passo 0).
2. Salve `hooks.json` ou reinicie o Cursor se os hooks não rodarem.  
<!-- [Documentação de hooks](https://cursor.com/docs/hooks) -->
<!-- Sem workspace confiável, o Cursor não executa hooks locais; este passo garante que o guardrail do bloco seguinte realmente dispare. -->

### E2 — Prompt que deve ser **bloqueado**

No **Composer**, cole **sem** nenhum `@`:

```text
Adicione testes not_null em fct_orders no mart.
```

**Esperado:** o envio é **bloqueado** com uma mensagem pedindo @-mention em arquivos.  
<!-- O hook só bloqueia quando o prompt parece pedido de mart/dbt e não tem `@` nem anexos de arquivo. -->
<!-- O bloqueio proposital demonstra o valor do hook: empurrar a pessoa a fornecer contexto suficiente antes de pedir edição em SQL/YAML. -->

### E3 — Mesma intenção, permitido

```text
@models/marts/schema.yml Adicione testes not_null em fct_orders.order_line_id e fct_orders.customer_key se ainda não existirem.
```

**Esperado:** o prompt **envia**; aplique as mudanças; depois:
<!-- A mesma intenção agora passa porque o pedido está ancorado em um arquivo real; o hook reforça hábito, não impede trabalho útil. -->

```bash
dbt test -s path:models/marts
```

<!-- Revalida os testes depois da edição guiada pelo hook para confirmar que a mudança ficou correta e não quebrou o mart. -->

---

## Bloco F — Capstone (~20 min)

### F1 — Composer (skill + @; satisfaz o hook)

Faça `@` na `SKILL.md` instalada, em `@models/marts/fct_orders.sql` (ou o caminho gerado), `@models/marts/schema.yml` e `@seeds/raw_orders.csv`.

Cole **literalmente**:

```text
Seguindo @.agents/skills/using-dbt-for-analytics-engineering/SKILL.md: adicione uma order_date_key em fct_orders (inteiro yyyymmdd ou surrogate de data fazendo join com um dim_date mínimo a partir das datas distintas de pedido no fato). Atualize @models/marts/schema.yml com uma frase descrevendo o grão de fct_orders (uma linha por ___). Mantenha os testes passando.
```

<!-- Ajuste o caminho da skill se não usou a dbt Labs. -->
<!-- O capstone força a combinar os aprendizados: skill pública, contexto explícito, documentação do grão e validação por testes. -->

### F2 — Verificar

```bash
dbt run -s path:models/marts
```

<!-- Reexecuta os marts após a mudança final para materializar a nova chave/estrutura antes da suíte de testes. -->

```bash
dbt test -s path:models/marts
```

<!-- Fecha o workshop com uma verificação objetiva: a entrega só está pronta se o slice novo do mart continuar passando nos testes. -->

---

## Referência rápida — comandos na ordem

<!-- Esta seção é uma cola operacional: útil para quem já entendeu o porquê dos passos e só quer repetir a sequência essencial sem reler o roteiro inteiro. -->

```bash
python -m venv .venv
.venv\Scripts\activate
pip install dbt-duckdb
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.dbt"; Copy-Item profiles.yml.example "$env:USERPROFILE\.dbt\profiles.yml"
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
