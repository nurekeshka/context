import type { Context } from "hono";
import { componentService } from "../../../application/services";
import { log } from "../../../logger";

export const createComponentRoute = async (c: Context) => {
	const body = await c.req.json<{ name: string }>();
	const { name } = body;
	const component = await componentService.create(name);
	log.component.created(name, component.id);
	return c.json({ component }, 201);
};

export const listComponentsRoute = async (c: Context) => {
	const components = await componentService.list();
	return c.json({ components });
};

export const deleteComponentRoute = async (c: Context) => {
	const id = c.req.param("id");
	if (!id) {
		return c.json({ error: "Component ID required" }, 400);
	}
	const deleted = await componentService.delete(id);
	if (!deleted) {
		return c.json({ error: "Component not found" }, 404);
	}
	log.component.deleted(id);
	return c.json({ deleted: true });
};
