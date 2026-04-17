---
sidebar_position: 4
---

# Events

## Create Event

Create an event for a task. This is the core operation that drives the event-sourced model.

<div class="api-endpoint">
  <span class="method post">POST</span> /agent/events
</div>

:::note
Requires authentication. Include `Authorization: Bearer <token>` header.
:::

### Request

```json
{
  "taskId": "550e8400-e29b-41d4-a716-446655440000",
  "type": "action",
  "description": "Started implementing feature X",
  "metadata": {
    "file": "src/feature.ts",
    "tool": "filesystem"
  }
}
```

### Event Types

| Type | Description |
|------|-------------|
| `action` | Something the agent did (file creation, API call, etc.) |
| `decision` | A decision made and why |
| `observation` | Something the agent observed or learned |
| `state_change` | A significant state transition |
| `coordination` | Communication with other agents |

### Response

```json
{
  "event": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "agentId": "550e8400-e29b-41d4-a716-446655440000",
    "taskId": "550e8400-e29b-41d4-a716-446655440000",
    "type": "action",
    "description": "Started implementing feature X",
    "metadata": {
      "file": "src/feature.ts"
    },
    "createdAt": "2026-04-17T00:00:00.000Z"
  }
}
```

### Errors

| Status | Description |
|--------|-------------|
| 404 | Task not found |

## Get Recent Events

Retrieve recent events across all tasks.

<div class="api-endpoint">
  <span class="method get">GET</span> /agent/events
</div>

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 100 | Maximum number of events to return |

### Response

```json
{
  "events": [
    {
      "id": "...",
      "taskId": "...",
      "type": "action",
      "description": "...",
      "createdAt": "2026-04-17T00:00:00.000Z"
    }
  ]
}
```

## Get Events by Task

Retrieve all events for a specific task.

<div class="api-endpoint">
  <span class="method get">GET</span> /agent/tasks/:taskId/events
</div>

### Response

```json
{
  "events": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "type": "decision",
      "description": "Chose to use Drizzle ORM for database access",
      "metadata": {
        "reason": "type-safe, lightweight, good Bun support"
      },
      "createdAt": "2026-04-17T00:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "type": "action",
      "description": "Created database schema",
      "metadata": {},
      "createdAt": "2026-04-17T00:00:01.000Z"
    }
  ]
}
```

## Best Practices

1. **Always emit events** - Even failed actions should be recorded
2. **Be descriptive** - Write clear descriptions that other agents can understand
3. **Use structured metadata** - Include tool-specific context for reproducibility
4. **Log decisions** - Use `decision` type to explain why something was done