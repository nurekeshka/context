import type { Context } from "hono";
import { eventService, taskService } from "../../../application/services";
import { log } from "../../../logger";

export const createEventRoute = async (c: Context) => {
	const agentId = c.get("agentId");
	const body = await c.req.json<{
		taskId: string;
		type: "action" | "decision" | "observation" | "state_change" | "coordination";
		description: string;
		metadata?: Record<string, unknown>;
	}>();
	const { taskId, type, description, metadata } = body;
	const task = await taskService.getById(taskId);
	if (!task) {
		return c.json({ error: "Task not found" }, 404);
	}
	const event = await eventService.create(agentId, taskId, type, description, metadata);
	log.event.created(taskId, type, event.id);
	return c.json({ event }, 201);
};

export const getEventsByTaskRoute = async (c: Context) => {
	const taskId = c.req.param("taskId");
	if (!taskId) {
		return c.json({ error: "Task ID required" }, 400);
	}
	const task = await taskService.getById(taskId);
	if (!task) {
		return c.json({ error: "Task not found" }, 404);
	}
	const events = await eventService.getByTask(taskId);
	log.event.retrieved(taskId, events.length);
	return c.json({ events });
};

export const getRecentEventsRoute = async (c: Context) => {
	const limit = c.req.query("limit");
	const events = await eventService.getRecent(limit ? parseInt(limit, 10) : 100);
	return c.json({ events });
};
