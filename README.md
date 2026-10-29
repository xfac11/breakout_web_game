# Breakout Web Game

This repository contains both the ASP.NET Core API and the Phaser/React frontend for the Breakout game.

The backend provides the game API and persistence layer. The frontend is a Vite-powered Phaser + React app that renders the playable game client in the browser.

## Requirements

- .NET 10 SDK
- Node.js 18+ and npm
- PostgreSQL (for local API development unless you override the connection string)

## Backend: run locally

From the repository root:

```powershell
dotnet run --project src/Breakout.Api
```

In development, the OpenAPI document is available at `/openapi/v1.json` and the health endpoint is `GET /health`.

### Backend build

```powershell
dotnet build Breakout.sln
```

## Frontend: run locally

Open a terminal in the `frontend` folder and install dependencies:

```powershell
cd frontend
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:8080` by default. The frontend includes a Phaser game setup in React and hot reload support for development.

### Frontend production build

```powershell
cd frontend
npm run build
```

## Project layout

- `ARCHITECTURE.md`: current architecture and development decisions
- `CONTRIBUTING.md`: issue, branch, pull request, review, and merge workflow
- `README.md`: repository overview and local setup instructions
- `breakout_web_game_project_plan.md`: product goals and implementation roadmap
- `src/Breakout.Api`: ASP.NET Core HTTP API
- `frontend/`: Phaser + React + TypeScript game client
  - `frontend/index.html`: application entry page
  - `frontend/public/`: static assets and styles
  - `frontend/src/`: React and game source code
  - `frontend/src/App.tsx`: main application shell
  - `frontend/src/PhaserGame.tsx`: Phaser bridge component
  - `frontend/src/game/`: Phaser scenes and game logic
  - `frontend/vite/`: Vite development and production configs
  - `frontend/package.json`: frontend scripts and dependencies

## Frontend overview

The game client is built with:

- Phaser 4
- React 19
- Vite 6
- TypeScript 5

It includes:

- a React entry point (`src/main.tsx`)
- a Phaser integration bridge (`src/PhaserGame.tsx`)
- game scenes such as Boot, Preloader, MainMenu, Game, and GameOver
- static assets stored under `public/assets`
- CSS in `public/style.css`

## Notes

- The API uses Entity Framework Core with the PostgreSQL provider.
- The default development connection string targets a local PostgreSQL instance.
- Override it with the `ConnectionStrings__DefaultConnection` environment variable when needed.
- Do not commit credentials or environment-specific secrets.
