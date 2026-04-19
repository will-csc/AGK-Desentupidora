# Backend

Backend estruturado com Node.js, TypeScript e Express.

## Estrutura

```text
src/
  config/                  # variaveis de ambiente e configuracoes
  modules/
    health/                # modulo inicial de exemplo
  routes/                  # rotas principais da API
  shared/
    middlewares/           # tratamento de erro e 404
    utils/                 # utilitarios compartilhados
  app.ts                   # configuracao do Express
  server.ts                # ponto de entrada da API
tests/                     # testes automatizados
```

## Scripts

- `npm run dev` inicia o servidor em desenvolvimento com `tsx`
- `npm run build` gera a pasta `dist`
- `npm run start` executa a versao compilada
- `npm run check` valida o TypeScript sem gerar build

## Primeiros Passos

1. Copie `.env.example` para `.env`
2. Rode `npm install`
3. Rode `npm run dev`

## Rotas Iniciais

- `GET /` retorna uma mensagem de status da API
- `GET /api/health` retorna o healthcheck do backend
