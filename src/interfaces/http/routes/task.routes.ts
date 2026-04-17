import type { Context } from "hono";
import { eventService, taskService } from "../../../application/services";
import { log } from "../../../logger";

export const createTaskRoute = async (c: Context) => {
	const body = await c.req.json<{ componentId?: string; name: string; description?: string }>();
	const { componentId, name, description } = body;
	const task = await taskService.create(componentId ?? null, name, description);
	log.task.created(name, task.id);
	return c.json({ task }, 201);
};

export const listTasksRoute = async (c: Context) => {
	const componentId = c.req.query("componentId");
	if (!componentId) {
		return c.json({ error: "componentId query parameter required" }, 400);
	}
	const tasks = await taskService.getByComponent(componentId);
	return c.json({ tasks });
};

export const getTaskRoute = async (c: Context) => {
	const id = c.req.param("id");
	if (!id) {
		return c.json({ error: "Task ID required" }, 400);
	}
	const task = await taskService.getById(id);
	if (!task) {
		return c.json({ error: "Task not found" }, 404);
	}
	const events = await eventService.getByTask(id);
	log.task.retrieved(id);
	return c.json({ events, task });
};

export const updateTaskStatusRoute = async (c: Context) => {
	const id = c.req.param("id");
	if (!id) {
		return c.json({ error: "Task ID required" }, 400);
	}
	const body = await c.req.json<{ status: "open" | "in_progress" | "done" | "cancelled" }>();
	const { status } = body;
	const task = await taskService.updateStatus(id, status);
	if (!task) {
		return c.json({ error: "Task not found" }, 404);
	}
	log.task.updated(id, status);
	return c.json({ task });
};
