---
sidebar_position: 3
---

# Event Sourcing

## Core Principle

**Events are the source of truth.** In ctx, tasks are derived projections of events. State is never directly mutated without an event. Every meaningful action creates an immutable event.

## How It Works

### Traditional vs Event-Sourced

**Traditional approach:**
```
User updates task status -> Task table updated
```

**Event-sourced approach:**
```
User updates task status -> Event created (type: state_change)
Task status derived from latest state_change event for that task
```

## Benefits

### 1. Complete Audit Trail

Every change is recorded as an event. You can reconstruct any state by replaying events:

```bash
# Get full history for a task
curl http://localhost:3000/agent/tasks/<task-id>
```

Returns the task plus all events in order.

### 2. Temporal Queries

You can ask questions like:
- "What decisions were made before 3pm?"
- "What files were modified in the last hour?"
- "Which agent worked on this first?"

### 3. Debugging

When something goes wrong, you can see exactly what happened:

```json
{
  "type": "action",
  "description": "Attempted to deploy",
  "metadata": {
    "error": "connection refused",
    "retry_count": 3
  }
}
```

### 4. Multi-Agent Transparency

All agents see the same history. There's no hidden state.

## Event Structure

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `taskId` | string (UUID) | The task this event belongs to |
| `type` | enum | Event type (action, decision, observation, state_change, coordination) |
| `description` | string | Human-readable explanation |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `metadata` | object | Structured data for tool-specific context |

## Event Types

### action

Something the agent did. Examples:
- Created a file
- Made an API call
- Ran a test
- Deployed code

```json
{
  "type": "action",
  "description": "Created database schema file",
  "metadata": {
    "file": "src/db/schema.ts",
    "tool": "filesystem"
  }
}
```

### decision

A choice made by the agent. Always include reasoning:

```json
{
  "type": "decision",
  "description": "Chose Drizzle over Prisma",
  "metadata": {
    "reason": "lighter weight, better Bun support, simpler migration"
  }
}
```

### observation

Something the agent learned or noticed:

```json
{
  "type": "observation",
  "description": "API response time degraded",
  "metadata": {
    "metric": "p99_latency",
    "value": "2.5s",
    "threshold": "1s"
  }
}
```

### state_change

A significant transition in task state:

```json
{
  "type": "state_change",
  "description": "Task marked as blocked",
  "metadata": {
    "previous": "in_progress",
    "current": "blocked",
    "reason": "waiting for API credentials"
  }
}
```

### coordination

Communication between agents:

```json
{
  "type": "coordination",
  "description": "Asked for code review",
  "metadata": {
    "target": "other-agent-id",
    "request": "please review PR #42"
  }
}
```

## When to Emit Events

### Always Emit

- After any meaningful action
- After making a decision
- When observing something relevant
- When state changes
- When communicating with other agents

### Example Timeline

```
1. Agent reads task context
2. Agent emits: decision ("chose approach")
3. Agent implements feature
4. Agent emits: action ("created file")
5. Agent tests
6. Agent emits: action ("tests passed")
7. Agent emits: state_change ("task done")
```

## Querying Events

### By Task

```bash
curl http://localhost:3000/agent/tasks/<task-id>/events
```

### Recent Across All Tasks

```bash
curl "http://localhost:3000/agent/events?limit=100"
```

### Filter by Type

Events are returned in order. Filter client-side:

```javascript
const actions = events.filter(e => e.type === 'action');
const decisions = events.filter(e => e.type === 'decision');
```

## Best Practices

1. **Emit events first** - Don't wait until end of task
2. **Be atomic** - One action = one event
3. **Include context** - Use metadata for tool-specific data
4. **Write for humans** - Description should be clear to other agents
5. **Log failures** - Emit events even when things go wrong