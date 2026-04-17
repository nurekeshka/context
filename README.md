# ctx - Event-Driven Coordination Platform for AI Agents

A production-ready backend system using Bun, Hono, Drizzle ORM, PostgreSQL, and Pino logging.

## Architecture

```
src/
├── config.ts                    # Environment variable validation
├── logger.ts                    # Pino logger with structured helpers
├── main.ts                      # Entry point
├── application/
│   ├── ports/                   # Interface contracts
│   │   ├── auth.port.ts
│   │   ├── event.port.ts
│   │   └── task.port.ts
│   └── services/                # Business logic
│       ├── auth.service.ts
│       ├── event.service.ts
│       └── task.service.ts
├── domain/                      # Pure domain types
│   ├── admin.ts
│   ├── agent.ts
│   ├── component.ts
│   ├── event.ts
│   └── task.ts
├── infrastructure/
│   └── db/                      # Data layer
│       ├── drizzle.ts
│       ├── schema.ts
│       ├── auth.repo.ts
│       ├── event.repo.ts
│       └── task.repo.ts
└── interfaces/
    └── http/                    # HTTP adapters
        ├── app.ts
        └── routes/
            ├── auth.routes.ts
            ├── task.routes.ts
            └── event.routes.ts
```

## Core Principles

- **Events are the source of truth** - Tasks are derived projections of events
- **Functional style** - No heavy OOP, no DI containers
- **Hexagonal architecture** - Clean separation of concerns

## Tech Stack

- **Runtime**: Bun
- **Framework**: Hono
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validation**: Zod + @hono/zod-validator
- **Auth**: @node-rs/argon2 (token hashing)
- **Logging**: Pino + pino-pretty

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your database URL and port
```

### 3. Push schema to database

```bash
bunx drizzle-kit push
```

### 4. Run the server

```bash
bun src/main.ts
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://localhost:5432/ctx` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `LOG_LEVEL` | Logger level | `info` |
| `LOG_PRETTY` | Pretty print logs | `true` |

## API Endpoints

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/login` | Validate agent token |

### Agents (Admin)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/admin/agents` | Create agent with token |
| GET | `/admin/agents` | List all agents |
| GET | `/admin/agents/:id` | Get specific agent |

### Tasks (Agent)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/agent/tasks` | Create task |
| GET | `/agent/tasks?componentId=` | List tasks by component |
| GET | `/agent/tasks/:id` | Get task with event history |
| PATCH | `/agent/tasks/:id/status` | Update task status |

### Events (Agent)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/agent/events` | Create event |
| GET | `/agent/events` | Get recent events |
| GET | `/agent/tasks/:taskId/events` | Get events for task |

## Example Usage

### Create an agent

```bash
curl -X POST http://localhost:3000/admin/agents \
  -H "Content-Type: application/json" \
  -d '{"name": "claude", "token": "my-secret-token"}'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"token": "my-secret-token"}'
```

### Create a task

```bash
curl -X POST http://localhost:3000/agent/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer my-secret-token" \
  -d '{"name": "Implement feature X"}'
```

### Create an event

```bash
curl -X POST http://localhost:3000/agent/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer my-secret-token" \
  -d '{
    "taskId": "<task-id>",
    "type": "action",
    "description": "Started implementing feature X",
    "metadata": {"file": "src/feature.ts"}
  }'
```

### Get task with event history

```bash
curl http://localhost:3000/agent/tasks/<task-id> \
  -H "Authorization: Bearer my-secret-token"
```

## Development

### Type checking

```bash
bun x tsc --noEmit
```

### Database migrations

```bash
bunx drizzle-kit push    # Push schema
bunx drizzle-kit studio  # Open DB studio
```