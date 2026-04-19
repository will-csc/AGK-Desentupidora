# AGK Desentupidora

Web system for **AGK Desentupidora**, including `frontend`, `backend`, documentation, and an initial database structure.

This repository was organized to serve as the foundation for the project's evolution, with focus on:

- company institutional presentation
- user authentication
- restricted area for classes and content
- Node.js API for future real integration
- centralized technical documentation

## Overview

The project is divided into four main parts:

- `frontend`: web application built with `React + Vite + TypeScript`
- `backend`: API built with `Node.js + Express + TypeScript`
- `docs`: technical documentation and execution guides
- `database`: initial structure for migrations, schema, and seeds

## Project Structure

```text
Agk-Desentupidora/
  frontend/
  backend/
  docs/
  database/
```

## Technologies

### Frontend

- React
- Vite
- TypeScript
- TanStack Router
- Tailwind CSS
- Radix UI

### Backend

- Node.js
- Express
- TypeScript
- dotenv

## Requirements

Before running the project, make sure you have installed:

- Node.js
- npm

## Running Locally

### 1. Running the Frontend

Open a terminal inside the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

Then open in your browser:

```text
http://localhost:5173
```

### 2. Running the Backend

Open another terminal inside the `backend` folder:

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Initial routes:

```text
http://localhost:3333/
http://localhost:3333/api/health
```

## Useful Scripts

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

## Documentation

Project guides and references:

- [Execution tutorial](./docs/tutorial-execucao.md)
- [General docs](./docs/README.md)
- [Frontend](./frontend/README.md)
- [Backend](./backend/README.md)

## Current Status

The project currently includes:

- frontend configured and running with Vite
- backend structured with Express
- execution tutorial
- initial folder organization for database and docs

## Next Steps

Suggested improvements:

- integrate the frontend with the real backend
- create an authentication module with JWT
- connect to a database
- add CRUD for services, clients, and service orders
- publish a production environment

## Publishing to GitHub

After creating the repository on GitHub, you can upload this project with:

```bash
git init
git add .
git commit -m "chore: initial project structure"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

## Note

This README was written to work well as the main page of the GitHub repository.
