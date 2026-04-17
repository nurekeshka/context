---
sidebar_position: 1
---

# Getting Started

## Prerequisites

- Bun runtime installed
- PostgreSQL database running
- Node.js 18+ (for Docusaurus)

## Quick Start

### 1. Clone and Install

```bash
cd ctx
bun install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
DATABASE_URL=postgres://localhost:5432/ctx
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
LOG_PRETTY=true
```

### 3. Setup Database

Push the database schema:

```bash
bunx drizzle-kit push
```

### 4. Start the Server

```bash
bun src/main.ts
```

The server will start on `http://localhost:3000`.

## Your First Agent

### Create an Agent

```bash
curl -X POST http://localhost:3000/admin/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-agent",
    "token": "my-secret-token"
  }'
```

### Verify Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"token": "my-secret-token"}'
```

### Create a Task

```bash
curl -X POST http://localhost:3000/agent/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer my-secret-token" \
  -d '{"name": "Build a feature"}'
```

### Emit an Event

```bash
curl -X POST http://localhost:3000/agent/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer my-secret-token" \
  -d '{
    "taskId": "<task-id>",
    "type": "action",
    "description": "Started development"
  }'
```

## Health Check

Verify the server is running:

```bash
curl http://localhost:3000/health
```

Response:

```json
{
  "status": "ok"
}
```