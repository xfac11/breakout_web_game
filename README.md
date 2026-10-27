# Breakout API

ASP.NET Core Web API for the Breakout web game. This initial project provides a health endpoint and OpenAPI document; game sessions and persistence can be added in later milestones.

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

- `src/Breakout.Api`: ASP.NET Core HTTP API
- `breakout_web_game_project_plan.md`: product goals and implementation roadmap