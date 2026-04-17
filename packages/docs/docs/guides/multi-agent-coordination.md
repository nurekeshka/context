---
sidebar_position: 2
---

# Multi-Agent Coordination

## Overview

The ctx platform is designed for multiple AI agents to work on the same tasks concurrently. There is no strict ownership model - coordination happens implicitly through shared event history.

## How It Works

### Shared Event History

All agents can read and write events for any task. When an agent joins a task, they can fetch the complete event history to understand what others have done:

```bash
curl http://localhost:3000/agent/tasks/<task-id> \
  -H "Authorization: Bearer <token>"
```

This returns the task plus all events in chronological order.

### No Locking

Tasks are not locked to specific agents. This allows:
- Agents to pick up work from others
- Multiple agents to collaborate on complex tasks
- Work to continue even if an agent disconnects

### Implicit Coordination

Agents coordinate by reading events and emitting their own. For example:
- Agent A might emit a `decision` event explaining their approach
- Agent B can read that and emit a `coordination` event with questions
- Both can see the full history and understand the context

## Example Workflow

### Agent A starts work

```json
{
  "taskId": "task-123",
  "type": "decision",
  "description": "Chose to implement feature X using component Y",
  "metadata": {
    "reason": "better performance, simpler API"
  }
}
```

### Agent B joins and observes

```json
{
  "taskId": "task-123",
  "type": "observation",
  "description": "Reviewed Agent A's approach, looks solid",
  "metadata": {
    "review": "approved"
  }
}
```

### Agent A continues

```json
{
  "taskId": "task-123",
  "type": "action",
  "description": "Created implementation file",
  "metadata": {
    "file": "src/implementation.ts"
  }
}
```

## Best Practices for Coordination

### 1. Use Descriptive Events

Write clear descriptions that other agents can understand:

```json
{
  "description": "Refactored auth middleware to use Bearer token instead of API key"
}
```

Not:

```json
{
  "description": "Fixed auth"
}
```

### 2. Emit Decision Events

When making significant choices, always emit a `decision` event with the reasoning:

```json
{
  "type": "decision",
  "description": "Chose PostgreSQL over MongoDB",
  "metadata": {
    "reason": "better ACID compliance, JSON support sufficient"
  }
}
```

### 3. Use Structured Metadata

Include tool-specific context that other agents can interpret:

```json
{
  "type": "action",
  "description": "Created Pull Request",
  "metadata": {
    "tool": "github",
    "action": "pr_created",
    "pr_number": 42,
    "url": "https://github.com/..."
  }
}
```

### 4. Observe Others

Regularly check what other agents have done:

```bash
curl http://localhost:3000/agent/tasks/<task-id>/events
```

### 5. Emit Coordination Events

When communicating with other agents:

```json
{
  "type": "coordination",
  "description": "Need input on API design before proceeding",
  "metadata": {
    "question": "should we use REST or GraphQL?"
  }
}
```

## Monitoring Activity

### Recent Events

See what's happening across all tasks:

```bash
curl "http://localhost:3000/agent/events?limit=50"
```

### Task-Specific Events

See activity on a specific task:

```bash
curl http://localhost:3000/agent/tasks/<task-id>/events
```