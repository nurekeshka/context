# Agent Integration Guide

This document describes how AI agents interact with the ctx platform.

## Overview

The ctx platform provides a shared "operational memory layer" for AI agents working on software development tasks. Agents collaborate by:

1. Reading contextual history (events)
2. Performing actions via MCP tools
3. Writing immutable events describing what they did and why

## Authentication

Agents authenticate using long-lived tokens:

1. An admin creates an agent with a token:
   ```bash
   curl -X POST http://localhost:3000/admin/agents \
     -H "Content-Type: application/json" \
     -d '{"name": "claude", "token": "your-token-here"}'
   ```

2. The agent uses this token in the `Authorization` header:
   ```
   Authorization: Bearer your-token-here
   ```

3. The token is hashed using argon2 before storage - never store raw tokens.

## Workflow

### 1. Get Task Context

Before performing work, agents should fetch the task's event history:

```bash
curl http://localhost:3000/agent/tasks/<task-id> \
  -H "Authorization: Bearer your-token"
```

This returns the task and all events in chronological order, providing full context of previous actions, decisions, and observations.

### 2. Perform Work

Agents execute their tasks using external tools (GitHub, Jira, MCP servers, etc.)

### 3. Emit Events

After ANY meaningful action, agents MUST emit an event:

```bash
curl -X POST http://localhost:3000/agent/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "taskId": "<task-id>",
    "type": "action",
    "description": "Created new feature file",
    "metadata": {
      "tool": "filesystem",
      "action": "create",
      "file": "src/features/new.ts"
    }
  }'
```

## Event Types

| Type | Description |
|------|-------------|
| `action` | Something the agent did (file creation, API call, etc.) |
| `decision` | A decision made and why |
| `observation` | Something the agent observed or learned |
| `state_change` | A significant state transition |
| `coordination` | Communication with other agents |

## Metadata

The `metadata` field is a flexible JSON object for tool-specific context. Examples:

```json
{
  "tool": "github",
  "action": "pr_created",
  "pr_number": 42,
  "url": "https://github.com/..."
}
```

```json
{
  "tool": "mcp",
  "server": "filesystem",
  "files_modified": ["src/a.ts", "src/b.ts"]
}
```

```json
{
  "tool": "analysis",
  "analysis_type": "complexity",
  "result": "high",
  "reason": "cyclomatic complexity > 20"
}
```

## Multi-Agent Coordination

Multiple agents can work on the same task concurrently. There is no strict ownership model - coordination happens implicitly through shared event history.

To see what other agents have done:

```bash
curl http://localhost:3000/agent/tasks/<task-id>/events \
  -H "Authorization: Bearer your-token"
```

## Best Practices

1. **Always emit events** - Even failed actions should be recorded
2. **Be descriptive** - Write clear descriptions that other agents can understand
3. **Use structured metadata** - Include tool-specific context for reproducibility
4. **Fetch context first** - Always check event history before making decisions
5. **Log decisions** - Use `decision` type to explain why something was done