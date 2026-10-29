# Breakout API

ASP.NET Core Web API for the Breakout web game. This initial project provides a health endpoint and OpenAPI document; game sessions and persistence can be added in later milestones.

Entity Framework Core is configured with the PostgreSQL provider. The default development connection string targets a local PostgreSQL instance; override it with the `ConnectionStrings__DefaultConnection` environment variable when needed. Do not commit credentials.

## Requirements

- .NET 10 SDK

## Run locally

From the repository root:

```powershell
dotnet run --project src/Breakout.Api
```

In Development, the OpenAPI document is available at `/openapi/v1.json`. The health endpoint is `GET /health`.

## Build

```powershell
dotnet build Breakout.sln
```

## Project layout

- `ARCHITECTURE.md`: current architecture and EF Core/PostgreSQL decision
- `CONTRIBUTING.md`: issue, branch, pull request, review, and merge workflow
- `src/Breakout.Api`: ASP.NET Core HTTP API
- `breakout_web_game_project_plan.md`: product goals and implementation roadmap
