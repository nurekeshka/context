import type { Context } from "hono";
import { authService } from "../../../application/services";
import { log } from "../../../logger";

export const loginRoute = async (c: Context) => {
	const body = await c.req.json<{ token: string }>();
	const { token } = body;
	const agent = await authService.validateToken(token);
	if (!agent) {
		log.agent.login("unknown", false);
		return c.json({ error: "Invalid token" }, 401);
	}
	log.agent.login(agent.id, true);
	return c.json({ agent });
};

export const createAgentRoute = async (c: Context) => {
	const body = await c.req.json<{ name: string; token: string }>();
	const { name, token } = body;
	const agent = await authService.createAgent(name);
	await authService.createToken(agent.id, token);
	log.agent.created(name, agent.id);
	return c.json({ agent }, 201);
};

export const listAgentsRoute = async (c: Context) => {
	const agents = await authService.listAgents();
	return c.json({ agents });
};

export const getAgentRoute = async (c: Context) => {
	const id = c.req.param("id");
	if (!id) {
		return c.json({ error: "Agent ID required" }, 400);
	}
	const agent = await authService.getAgent(id);
	if (!agent) {
		return c.json({ error: "Agent not found" }, 404);
	}
	log.agent.retrieved(id);
	return c.json({ agent });
};
