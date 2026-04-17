---
name: ctx
description: Interact with the ctx shared context platform — create tasks, emit events, read event history, and coordinate with other agents working on the same project.
---

# ctx — Shared Context for AI Agents

Use the ctx MCP tools to coordinate with other agents and developers. ctx is the shared operational memory layer — you read context, do work, and write events back so everyone stays in sync.

## Setup

### Prerequisites

- The ctx API server must be running (default: `http://localhost:3000`)
- The `ctx` and `ctx-mcp` binaries must be installed (`/usr/local/bin/`)

### First-Time Setup (Admin)

If no agents exist yet, create one and authenticate:

```bash
# 1. Create an agent (picks a name and token)
ctx agents create <agent-name> --token <secret-token>

# 2. Login (saves credentials to ~/.ctx/config.json)
ctx login <secret-token> --url http://localhost:3000
```

### Verify Authentication

```bash
# Check saved config
ctx config show

# Test connectivity — should return events (or empty list)
ctx events list
```

### MCP Server Configuration

The `ctx-mcp` binary reads credentials from `~/.ctx/config.json` (written by `ctx login`). To add it to an agent's MCP config:

```json
{
  "mcpServers": {
    "ctx": {
      "command": "ctx-mcp"
    }
  }
}
```

For Claude Code, this goes in `~/.claude/settings.json` (global) or `.claude/settings.json` (per-project).

### Troubleshooting

- **"Not configured"** — run `ctx login <token>` to authenticate
- **Connection refused** — ensure the ctx API server is running on the configured URL
- **401 Unauthorized** — token is invalid or expired; re-run `ctx login` with a valid token
- **Check config** — `cat ~/.ctx/config.json` to see stored serverUrl and token

## CLI Reference

| Command | Description |
|---|---|
| `ctx login <token> [--url <url>]` | Authenticate and save credentials |
| `ctx config show` | Show current config |
| `ctx config set-url <url>` | Change server URL |
| `ctx agents create <name> --token <t>` | Create agent (admin) |
| `ctx agents list` | List all agents |
| `ctx agents get <id>` | Get agent details |
| `ctx tasks create <name> [opts]` | Create a task |
| `ctx tasks list --component <id>` | List tasks by component |
| `ctx tasks get <id>` | Get task + event history |
| `ctx tasks update-status <id> <status>` | Update task status |
| `ctx events create [opts]` | Create an event |
| `ctx events list [--limit n]` | List recent events |
| `ctx events by-task <taskId>` | Events for a task |

## Core Workflow

1. **Get context first** — before starting work, call `get_task` to read the task and its full event history
2. **Do your work** — use your own tools (filesystem, git, etc.)
3. **Emit events** — after every meaningful action, call `create_event` to record what you did and why

## Tools

### Tasks

| Tool | Purpose | Required Args |
|---|---|---|
| `create_task` | Create a new task | `name` |
| `list_tasks` | List tasks for a component | `componentId` |
| `get_task` | Get task + full event history | `id` |
| `update_task_status` | Change task status | `id`, `status` |

Task statuses: `open`, `in_progress`, `done`, `cancelled`

### Events

| Tool | Purpose | Required Args |
|---|---|---|
| `create_event` | Record what happened | `taskId`, `type`, `description` |
| `list_events` | Recent events across all tasks | (none) |
| `get_task_events` | Events for a specific task | `taskId` |

### Event Types

Choose the right type for what you're recording:

| Type | When to use |
|---|---|
| `action` | You did something (created a file, made an API call, ran a command) |
| `decision` | You chose a path and want to explain why |
| `observation` | You noticed something relevant (a bug, a pattern, a risk) |
| `state_change` | Something significant changed state (deploy finished, test suite passed) |
| `coordination` | Communication with other agents (requesting help, handing off work) |

### Metadata

The `metadata` field on events is optional but strongly recommended. Use it for structured, machine-readable context:

```json
{
  "tool": "filesystem",
  "action": "create",
  "files": ["src/features/auth.ts", "src/features/auth.test.ts"]
}
```

```json
{
  "tool": "git",
  "action": "commit",
  "sha": "abc123",
  "message": "add auth middleware"
}
```

## Best Practices

- **Always emit events** — even failed actions should be recorded so other agents know what was tried
- **Be descriptive** — write descriptions that another agent (or human) can understand without extra context
- **Fetch before deciding** — always read the event history before making decisions, so you don't repeat work or contradict earlier choices
- **Use structured metadata** — include tool names, file paths, and action types so events are searchable and machine-readable
- **Log decisions explicitly** — when you choose between options, emit a `decision` event explaining your reasoning
