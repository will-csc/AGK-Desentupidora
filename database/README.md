# Database

Estrutura inicial para a camada de banco:

```text
migrations/   # versionamento de alteracoes no banco
schema/       # definicoes de tabelas, modelos ou ORM
seeds/        # dados iniciais e populacao local
```

Sugestao de uso:

- guardar scripts SQL ou arquivos do ORM em `schema/`
- versionar mudancas em `migrations/`
- manter dados de desenvolvimento em `seeds/`
