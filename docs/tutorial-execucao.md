# Tutorial de Execucao

Este guia mostra como rodar o projeto localmente, separando `frontend` e `backend`.

## Requisitos

- Node.js instalado
- npm disponivel no terminal

## Estrutura

```text
frontend/   # aplicacao web com Vite + React
backend/    # API Node.js com Express + TypeScript
```

## Rodando o Frontend

1. Abra um terminal na pasta `frontend`

```bash
cd frontend
```

2. Instale as dependencias

```bash
npm install
```

3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

4. Abra a URL exibida no terminal

Normalmente o Vite sobe em:

```text
http://localhost:5173
```

## Rodando o Backend

1. Abra outro terminal na pasta `backend`

```bash
cd backend
```

2. Crie o arquivo `.env` com base no exemplo

```bash
copy .env.example .env
```

Se estiver usando outro terminal que nao seja PowerShell/Windows, crie o arquivo manualmente com:

```text
PORT=3333
NODE_ENV=development
```

3. Instale as dependencias

```bash
npm install
```

4. Inicie o backend

```bash
npm run dev
```

5. Teste as rotas iniciais

```text
http://localhost:3333/
http://localhost:3333/api/health
```

## Comandos Uteis

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

### Backend

```bash
npm run dev
npm run check
npm run build
npm run start
```

## Ordem Recomendada

1. Suba o `backend`
2. Suba o `frontend`
3. Abra o navegador na URL do Vite

## Observacoes

- O frontend hoje roda de forma independente do backend para a autenticacao mockada.
- Quando integrar API real, o frontend podera consumir o backend em `http://localhost:3333`.
