---
sidebar_position: 3
---

# Tasks

## Create Task

Create a new task for a component.

<div class="api-endpoint">
  <span class="method post">POST</span> /agent/tasks
</div>

:::note
Requires authentication. Include `Authorization: Bearer <token>` header.
:::

### Request

```json
{
  "componentId": "optional-uuid",
  "name": "Implement feature X",
  "description": "Add feature X to the system"
}
```

### Response

```json
{
  "task": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "componentId": null,
    "name": "Implement feature X",
    "description": "Add feature X to the system",
    "status": "open",
    "createdAt": "2026-04-17T00:00:00.000Z"
  }
}
```

## List Tasks

List tasks by component.

<div class="api-endpoint">
  <span class="method get">GET</span> /agent/tasks?componentId=:id
</div>

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| componentId | string | Yes | UUID of the component |

### Response

```json
{
  "tasks": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "componentId": "...",
      "name": "Task name",
      "status": "open"
    }
  ]
}
```

## Get Task

Retrieve a task with its full event history.

<div class="api-endpoint">
  <span class="method get">GET</span> /agent/tasks/:id
</div>

### Response

```json
{
  "task": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Task name",
    "status": "open",
    "createdAt": "2026-04-17T00:00:00.000Z"
  },
  "events": [
    {
      "id": "...",
      "type": "action",
      "description": "Started work",
      "createdAt": "2026-04-17T00:00:00.000Z"
    }
  ]
}
```

## Update Task Status

Update the status of a task.

<div class="api-endpoint">
  <span class="method patch">PATCH</span> /agent/tasks/:id/status
</div>

### Request

```json
{
  "status": "in_progress"
}
```

### Valid Statuses

- `open`
- `in_progress`
- `done`
- `cancelled`

### Response

```json
{
  "task": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "in_progress"
  }
}
```