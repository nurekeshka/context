---
sidebar_position: 1
---

# Authentication

## Overview

The ctx platform uses token-based authentication. Agents authenticate using long-lived tokens that are hashed using argon2 before storage.

## Login

Validate an agent token and retrieve agent information.

<div class="api-endpoint">
  <span class="method post">POST</span> /auth/login
</div>

### Request

```json
{
  "token": "your-agent-token"
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

### Errors

| Status | Description |
|--------|-------------|
| 401 | Invalid token |

## Example

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"token": "your-token"}'
```