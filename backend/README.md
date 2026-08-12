# Task Tracker API

NestJS API for a collaborative task tracker. It uses PostgreSQL with Prisma: the relational model maps workspaces, roles, projects, tasks, comments and status history directly, while database constraints and indexes protect data integrity and common filters.

## What is included

- JWT access (15 minutes) and refresh (7 days) token rotation; refresh tokens are stored hashed.
- Rate limiting, Helmet, strict DTO validation, CORS and a consistent JSON error response.
- Workspace owner/member roles, owner-only member management and project deletion.
- Projects, task CRUD with filtered offset pagination, comments CRUD, status-change audit log and authenticated Socket.IO project rooms.
- Swagger UI at `/api/docs` and a health endpoint at `/health`.

## Run locally

```bash
cp .env.example .env
npm ci
npx prisma migrate dev
npm run start:dev
```

The API listens at `http://localhost:3000`. Start PostgreSQL from the repository root with `docker compose up postgres`.

## Run in Docker

From the repository root:

```bash
docker compose up --build
```

This starts PostgreSQL, applies migrations, then starts the API. For non-local environments, set strong `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` values before starting it.

## Verification

```bash
npm run build
npm test
npm run test:e2e
```

The e2e suite requires a running database matching `DATABASE_URL`.

## Intentional scope boundary

Email invitations are represented by adding an already registered user by email; delivery of an email invite and a background queue would be the next production-oriented extension. Offset pagination is retained for clarity and is capped at 100 records per request.
