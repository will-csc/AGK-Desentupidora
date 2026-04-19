# Frontend

Estrutura sugerida para evolucao do aplicativo:

```text
src/
  assets/           # imagens e arquivos estaticos
  components/
    common/         # componentes pequenos e reutilizaveis
    layout/         # header, footer, shells e elementos de estrutura
    shared/         # componentes compartilhados entre fluxos
    ui/             # componentes base da interface
  hooks/            # hooks reutilizaveis
  lib/              # providers, auth, tema e utilitarios globais
  pages/            # implementacao visual das paginas
  routes/           # arquivos de roteamento do TanStack Router
```

Regra pratica:

- `routes/` define caminho e integra com o router.
- `pages/` concentra a implementacao da tela.
- `components/` guarda blocos reutilizaveis da interface.
