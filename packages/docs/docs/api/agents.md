---
sidebar_position: 2
---

# Agents

## Create Agent

Create a new agent with a token.

<div class="api-endpoint">
  <span class="method post">POST</span> /admin/agents
</div>

### Request

```json
{
  "name": "claude",
  "token": "your-secret-token"
}
```

### Response

```json
{
  "agent": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "claude",
    "createdAt": "2026-04-17T00:00:00.000Z"
  }
}
```

## List Agents

Retrieve all agents.

<div class="api-endpoint">
  <span class="method get">GET</span> /admin/agents
</div>

### Response

```json
{
  "agents": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "claude",
      "createdAt": "2026-04-17T00:00:00.000Z"
    }
  ]
}
```

## Get Agent

Retrieve a specific agent by ID.

<div class="api-endpoint">
  <span class="method get">GET</span> /admin/agents/:id
</div>

### Response

```json
{
  "agent": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "claude",
    "createdAt": "2026-04-17T00:00:00.000Z"
  }
}
```

### Errors

| Status | Description |
|--------|-------------|
| 404 | Agent not found |