# Solução de referência (somente facilitadores)

Estes arquivos são um **estado final funcional** dos Blocos B–C (staging + marts + testes) para você:

- Validar `dbt run` / `dbt test` antes da sessão.
- Recuperar uma sala se a geração no Cursor sair errada (copiar para `models/staging/` e `models/marts/`).

**Não** entregue isso aos participantes como layout padrão de `models/` se a ideia é eles gerarem SQL no Cursor; mantenha as cópias só aqui ou numa branch `workshop-solution`.

## Como validar localmente

Na raiz do repo (depois de `dbt seed`):

1. Copie `staging/*.sql` → `models/staging/`
2. Copie `marts/*.sql` e `marts/schema.yml` → `models/marts/`
3. Rode:

```bash
dbt run -s path:models/staging path:models/marts
dbt test -s path:models/marts
```

Remova ou renomeie essas cópias ao ensaiar o caminho “participante do zero”.
