# Breakout Web Game — Project Plan

## 1. Project goal

Build a browser-based Breakout game backed by a well-structured web API. The game provides a practical frontend, while the main learning and portfolio focus is backend development with C#, ASP.NET Core, relational database design, testing, security, and deployment.

**Guiding principle:** Keep the game playable and responsive in the browser. Use the backend for persistent data, user identity, application rules, and validated game results.

## 2. Recommended technology stack

| Component | Technology | Purpose |
|---|---|---|
| Frontend language | TypeScript | Frontend and game integration |
| Frontend UI | React | Menus, login, profiles, leaderboards |
| Game framework | Phaser | Rendering, game loop, input, and game infrastructure |
| Backend | ASP.NET Core Web API | HTTP API and application logic |
| Backend language | C# | Server-side implementation |
| ORM | Entity Framework Core | Database access and migrations |
| Database | PostgreSQL | Persistent application data |
| Testing | xUnit | Unit and integration tests |
| API documentation | OpenAPI | Document and explore API endpoints |
| Containerization | Docker | Reproducible development and deployment |
| CI/CD | GitHub Actions | Automated checks and build workflows |

### Useful official documentation

- [ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [Phaser](https://phaser.io/)
- [PostgreSQL documentation](https://www.postgresql.org/docs/)
- [Docker documentation](https://docs.docker.com/)

Don't try to learn every technology at once. Start with the API and database, then introduce the frontend and deployment tools as the project needs them.

## 3. High-level architecture

```text
┌──────────────────────────────────────────────┐
│                   Frontend                   │
│                                              │
│  React UI                 Phaser game        │
│  - Login / profile        - Rendering        │
│  - Leaderboards           - Input            │
│  - Game history           - Local simulation │
│            └──────────┬──────────────────────┘
└───────────────────────┼──────────────────────┘
                        │ HTTP / JSON
┌───────────────────────▼──────────────────────┐
│               ASP.NET Core API               │
│                                              │
│  HTTP endpoints and authentication           │
│  Application use cases and business rules    │
│  Persistence integration                     │
└───────────────────────┬──────────────────────┘
                        │
┌───────────────────────▼──────────────────────┐
│                  PostgreSQL                  │
│                                              │
│  Users · Game sessions · Results             │
│  Achievements · Player statistics            │
└──────────────────────────────────────────────┘
```

Start with a **modular monolith**: one backend application organized into modules, rather than independently deployed microservices. This keeps deployment simple while encouraging clear boundaries.

### Responsibility boundaries

**Frontend**
- Render the game and handle player input.
- Run the real-time game simulation.
- Display menus, profiles, scores, and leaderboards.
- Communicate with the backend API.

**Backend**
- Register and authenticate users.
- Create and manage game sessions.
- Validate and persist results.
- Enforce authorization rules.
- Serve leaderboards and player statistics.
- Track achievements.

**Database**
- Persist user accounts and game results.
- Maintain relationships and data integrity.
- Support queries for history, statistics, and leaderboards.

The frontend should not need to send the ball's position to the backend every frame. Keep gameplay responsive in the browser.

## 4. Backend architecture

A possible solution structure is:

```text
Breakout/
├── src/
│   ├── Breakout.Api/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   ├── Authentication/
│   │   └── Program.cs
│   ├── Breakout.Application/
│   │   ├── Games/
│   │   ├── Players/
│   │   ├── Leaderboards/
│   │   └── Achievements/
│   ├── Breakout.Domain/
│   │   ├── Games/
│   │   ├── Players/
│   │   └── Achievements/
│   └── Breakout.Infrastructure/
│       ├── Persistence/
│       ├── Repositories/
│       └── Authentication/
├── tests/
│   ├── Breakout.Domain.Tests/
│   ├── Breakout.Application.Tests/
│   └── Breakout.Api.IntegrationTests/
├── frontend/
│   ├── src/
│   └── package.json
├── compose.yaml
└── README.md
```

Treat this as a possible destination, not a checklist of directories to create immediately.

| Project | Responsibility |
|---|---|
| `Breakout.Api` | HTTP endpoints, request/response handling, authentication configuration |
| `Breakout.Application` | Application workflows and use cases |
| `Breakout.Domain` | Core business rules and domain concepts |
| `Breakout.Infrastructure` | PostgreSQL, Entity Framework Core, and external integrations |

### Example request flow

When a player completes a game:

1. The API receives the request.
2. The application layer executes the `CompleteGame` use case.
3. Domain rules check the result and game state.
4. The infrastructure layer persists the accepted result.
5. The API returns an appropriate HTTP response.

The domain should not depend on ASP.NET Core, Entity Framework Core, or PostgreSQL. This makes core rules easier to test.

Avoid overengineering: use abstractions, interfaces, and repositories when they solve a real problem, not automatically for every class.

## 5. Initial API design

Use versioned resource-oriented endpoints. The following are starting proposals; refine them as the requirements become clearer.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/games` | Start a game session |
| `POST` | `/api/v1/games/{id}/complete` | Submit a completed game |
| `GET` | `/api/v1/games/{id}` | Retrieve a game result |
| `GET` | `/api/v1/leaderboard` | Retrieve ranked scores |
| `POST` | `/api/v1/auth/register` | Register a user |
| `POST` | `/api/v1/auth/login` | Authenticate |
| `GET` | `/api/v1/users/me` | Retrieve the current user |
| `GET` | `/api/v1/users/me/games` | Retrieve the current user's game history |
| `GET` | `/api/v1/users/{id}/stats` | Retrieve player statistics |

The authentication endpoints and private user endpoints can be added in a later milestone.

### Example: starting a game

```http
POST /api/v1/games
```

Possible response:

```json
{
  "id": "game-session-id",
  "status": "active",
  "startedAt": "2026-10-27T12:00:00Z"
}
```

### Example: submitting a result

```http
POST /api/v1/games/game-session-id/complete
Content-Type: application/json
```

```json
{
  "score": 1250,
  "levelReached": 3,
  "durationSeconds": 184
}
```

The backend should associate the result with the correct game session and authenticated user, where applicable. Do not treat a user ID supplied in the request body as proof of identity; derive the user from the authenticated session or token.

## 6. Database design

Use PostgreSQL for persistent application data. Start with the minimum schema and add features when needed.

### `users`

| Column | Purpose |
|---|---|
| `id` | Unique user identifier, such as a UUID |
| `username` | Public player name |
| `email` | Account email |
| `password_hash` | Secure password hash, if managing passwords directly |
| `created_at` | Account creation timestamp |

Never store plaintext passwords. Prefer established identity and password-hashing facilities over custom cryptography.

### `games`

| Column | Purpose |
|---|---|
| `id` | Unique game identifier |
| `user_id` | Player who played; potentially nullable for guest games |
| `score` | Final score |
| `level_reached` | Highest level reached |
| `duration_seconds` | Game duration |
| `completed_at` | Completion timestamp |
| `status` | For example, active or completed |

Use a foreign key from `games.user_id` to `users.id` when a user is associated with a game.

### Achievements (later)

- `achievements`: achievement definitions, descriptions, and unlock criteria.
- `user_achievements`: join table linking users to achievements, with an `unlocked_at` timestamp.

Keep achievement definitions separate from each user's unlock records.

Start by querying game records for statistics. Consider cached or precomputed statistics only if performance or requirements justify them.

## 7. Game-result integrity and security

A browser client can be modified, and users can send arbitrary HTTP requests. A submitted score is therefore **untrusted input**.

### Initial safeguards

- Validate request structure and reasonable value ranges.
- Ensure the game session exists and is in a valid state.
- Prevent a completed session from being completed repeatedly.
- Associate the session with the correct authenticated user.
- Apply rate limits where appropriate.
- Use database constraints and transactions where they protect invariants.
- Log suspicious or invalid submissions without exposing sensitive data.

These checks improve correctness but do **not** prove that the score was legitimately earned.

### Possible verification strategies

1. **Basic validation:** Simple and appropriate for an early version, but offers limited protection against fabricated scores.
2. **Server-authoritative simulation:** The server processes player actions and determines the score. This provides stronger control but adds networking and simulation complexity.
3. **Replay verification:** Record player inputs and verify them against a deterministic simulation. This requires carefully designed verification rules; replaying a client-provided log alone is not proof of legitimacy.

Begin with basic validation and clearly document its limitations. Consider stronger verification as an advanced feature.

## 8. Development roadmap

### Milestone 1 — Playable game

**Goal:** A complete local game.

- [ ] Create a minimal TypeScript frontend.
- [ ] Use Phaser for game infrastructure.
- [ ] Implement paddle movement, ball behavior, brick collisions, scoring, lives, and restart.
- [ ] Keep the game playable without a network connection.

**Success criterion:** A player can complete a game locally.

### Milestone 2 — API and database

**Goal:** Save and retrieve completed games.

- [ ] Create the ASP.NET Core Web API.
- [ ] Set up PostgreSQL.
- [ ] Add Entity Framework Core and database migrations.
- [ ] Implement game-session creation.
- [ ] Implement result submission and retrieval.
- [ ] Add validation and consistent error responses.
- [ ] Write application and API tests.
- [ ] Connect the frontend to the API.

Guest play can be supported initially. Decide how guest identities should work before designing them into the database.

**Success criterion:** A completed game is saved in PostgreSQL and can be retrieved after the application restarts.

### Milestone 3 — Accounts and authorization

**Goal:** Support multiple players.

- [ ] Implement registration and login.
- [ ] Use secure password storage or an established identity provider/framework.
- [ ] Configure authentication and authorization.
- [ ] Add player profiles.
- [ ] Add private game history.
- [ ] Test that users cannot access or modify other users' private data.

For a first-party browser application, secure cookie-based authentication can be a good option when configured with appropriate protections. JWTs are not automatically required just because the backend exposes a REST API.

**Success criterion:** Multiple users can register, play, and view their own data securely.

### Milestone 4 — Leaderboards and statistics

**Goal:** Add useful features that exercise database design.

- [ ] Implement a global leaderboard.
- [ ] Show personal bests and game history.
- [ ] Add statistics such as total games and highest level.
- [ ] Support pagination and sensible ordering.
- [ ] Add daily or weekly rankings if desired.
- [ ] Inspect query performance and add indexes where justified.

**Success criterion:** Leaderboards and player statistics are correct, paginated, and reasonably efficient.

### Milestone 5 — Score verification

**Goal:** Improve confidence in recorded results.

- [ ] Document the threat model and limitations of client-submitted scores.
- [ ] Define rules for valid game sessions and results.
- [ ] Implement a stronger verification approach if time permits.
- [ ] Test invalid, repeated, and suspicious submissions.

**Success criterion:** The application has a documented, tested approach to score validation and does not overstate its guarantees.

### Milestone 6 — Production readiness

**Goal:** Make the project usable by others.

- [ ] Add Docker-based local development.
- [ ] Configure secrets and environment-specific settings safely.
- [ ] Document database migration and startup steps.
- [ ] Add structured logging and health checks.
- [ ] Add HTTPS in deployment.
- [ ] Run tests and builds in CI.
- [ ] Document backups and recovery considerations.
- [ ] Deploy the application.

**Success criterion:** Someone can follow the README, run the application, register, play, and retrieve saved results.

## 9. Testing strategy

Use different levels of tests for different concerns.

- **Domain unit tests:** Test game-result rules and other core logic without a database or web server.
- **Application tests:** Test use cases, including how they handle invalid sessions and repeated completion attempts.
- **API integration tests:** Test routing, request validation, authentication, authorization, and response codes.
- **Database integration tests:** Verify persistence and important database constraints against PostgreSQL or a suitably managed test database.
- **Frontend checks:** Run TypeScript checks and test important API integration behavior.

Use xUnit for C# tests. Keep tests focused on behavior and meaningful edge cases rather than implementation details.

## 10. Portfolio priorities

Prioritize a well-finished application over a large feature list.

| Priority | Demonstrates |
|---|---|
| Clear architecture and boundaries | Maintainability and design reasoning |
| Secure authentication and authorization | Security fundamentals |
| Thoughtful schema and SQL queries | Relational database skills |
| Unit and integration tests | Software quality |
| Deployment and reproducible setup | Practical delivery skills |
| Score validation | Trust boundaries and threat modeling |
| Caching or background processing, if justified | Deeper backend knowledge |

### README contents

- [ ] Project overview and screenshots
- [ ] Architecture diagram
- [ ] Database ER diagram
- [ ] Technology stack
- [ ] Local setup instructions
- [ ] Environment variable documentation (without real secrets)
- [ ] API documentation and example requests
- [ ] How to run tests
- [ ] Design decisions and trade-offs
- [ ] Security considerations and known limitations
- [ ] Deployment information

## 11. First implementation milestone

Start with a narrow vertical slice:

> **A guest can play Breakout, submit a completed game, and retrieve the saved result.**

Suggested order:

1. Create the ASP.NET Core Web API project.
2. Start PostgreSQL locally.
3. Add Entity Framework Core and an initial migration.
4. Define the game-session model and its state transitions.
5. Implement endpoints to create, complete, and retrieve games.
6. Test the API through OpenAPI or an HTTP client before building the frontend.
7. Add tests for valid and invalid completion attempts.
8. Build the minimal Phaser frontend.
9. Connect the frontend to the API.
10. Document how to run the vertical slice.

This lets backend work progress independently of frontend development.

## 12. Key principles to keep in mind

- Build a modular monolith before considering microservices.
- Keep real-time gameplay on the client unless a specific requirement justifies server-side simulation.
- Treat all client-submitted data as untrusted.
- Keep domain rules independent of web and database frameworks.
- Use asynchronous C# APIs for I/O where appropriate.
- Use abstractions when they provide value, not by default.
- Add complexity in response to concrete requirements.
- Document important design choices and their trade-offs.

**Recommended starting stack:** TypeScript + React + Phaser on the frontend, ASP.NET Core Web API + Entity Framework Core on the backend, and PostgreSQL for persistence.

The main goal is not to build the most elaborate game. It is to deliver a secure, tested, documented, and deployable web application that demonstrates strong backend engineering.
