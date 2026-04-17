import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ApiClient, ApiError } from "../client/api.ts";

function errorResult(err: unknown) {
	const msg = err instanceof ApiError
		? `Error ${err.status}: ${err.message}`
		: err instanceof Error ? err.message : String(err);
	return { content: [{ type: "text" as const, text: msg }], isError: true };
}

export function registerTools(server: McpServer, client: ApiClient): void {
	server.tool(
		"create_task",
		"Create a new task in the ctx platform",
		{
			name: z.string().describe("Task name"),
			componentId: z.string().optional().describe("Component ID"),
			description: z.string().optional().describe("Task description"),
		},
		async ({ name, componentId, description }) => {
			try {
				const { task } = await client.createTask({ name, componentId, description });
				return { content: [{ type: "text", text: JSON.stringify(task, null, 2) }] };
			} catch (err) {
				return errorResult(err);
			}
		},
	);

	server.tool(
		"list_tasks",
		"List tasks for a component",
		{
			componentId: z.string().describe("Component ID to filter tasks"),
		},
		async ({ componentId }) => {
			try {
				const { tasks } = await client.listTasks(componentId);
				return { content: [{ type: "text", text: JSON.stringify(tasks, null, 2) }] };
			} catch (err) {
				return errorResult(err);
			}
		},
	);

	server.tool(
		"get_task",
		"Get a task with its full event history",
		{
			id: z.string().describe("Task ID"),
		},
		async ({ id }) => {
			try {
				const result = await client.getTask(id);
				return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
			} catch (err) {
				return errorResult(err);
			}
		},
	);

	server.tool(
		"update_task_status",
		"Update a task's status",
		{
			id: z.string().describe("Task ID"),
			status: z.enum(["open", "in_progress", "done", "cancelled"]).describe("New status"),
		},
		async ({ id, status }) => {
			try {
				const { task } = await client.updateTaskStatus(id, status);
				return { content: [{ type: "text", text: JSON.stringify(task, null, 2) }] };
			} catch (err) {
				return errorResult(err);
			}
		},
	);

	server.tool(
		"create_event",
		"Create an event on a task to record an action, decision, observation, state change, or coordination",
		{
			taskId: z.string().describe("Task ID"),
			type: z.enum(["action", "decision", "observation", "state_change", "coordination"]).describe("Event type"),
			description: z.string().describe("What happened and why"),
			metadata: z.record(z.unknown()).optional().describe("Structured metadata object"),
		},
		async ({ taskId, type, description, metadata }) => {
			try {
				const { event } = await client.createEvent({ taskId, type, description, metadata });
				return { content: [{ type: "text", text: JSON.stringify(event, null, 2) }] };
			} catch (err) {
				return errorResult(err);
			}
		},
	);

	server.tool(
		"list_events",
		"List recent events across all tasks",
		{
			limit: z.number().int().positive().optional().describe("Max events to return (default 100)"),
		},
		async ({ limit }) => {
			try {
				const { events } = await client.listEvents(limit);
				return { content: [{ type: "text", text: JSON.stringify(events, null, 2) }] };
			} catch (err) {
				return errorResult(err);
			}
		},
	);

	server.tool(
		"get_task_events",
		"Get all events for a specific task",
		{
			taskId: z.string().describe("Task ID"),
		},
		async ({ taskId }) => {
			try {
				const { events } = await client.getTaskEvents(taskId);
				return { content: [{ type: "text", text: JSON.stringify(events, null, 2) }] };
			} catch (err) {
				return errorResult(err);
			}
		},
	);
}
