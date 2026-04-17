import { Hono, type MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import { authService } from "../../application/services";
import { log } from "../../logger";

import * as authRoutes from "./routes/auth.routes";
import * as eventRoutes from "./routes/event.routes";
import * as taskRoutes from "./routes/task.routes";

type AgentVariables = {
	agentId: string;
};

export const app = new Hono<{ Variables: AgentVariables }>();

app.use("*", cors());

app.use("*", async (c, next) => {
	const start = Date.now();
	await next();
	const duration = Date.now() - start;
	log.request(c.req.method, c.req.path, c.res.status, duration);
});

app.get("/health", (c) => c.json({ status: "ok" }));

app.post("/auth/login", authRoutes.loginRoute);
app.post("/admin/agents", authRoutes.createAgentRoute);
app.get("/admin/agents", authRoutes.listAgentsRoute);
app.get("/admin/agents/:id", authRoutes.getAgentRoute);

const agentAuthMiddleware: MiddlewareHandler = async (c, next) => {
	const authHeader = c.req.header("Authorization");
	if (!authHeader?.startsWith("Bearer ")) {
		return c.json({ error: "Missing or invalid Authorization header" }, 401);
	}
	const token = authHeader.slice(7);
	const agent = await authService.validateToken(token);
	if (!agent) {
		return c.json({ error: "Invalid token" }, 401);
	}
	c.set("agentId", agent.id);
	await next();
};

app.use("/agent/*", agentAuthMiddleware);

app.post("/agent/tasks", taskRoutes.createTaskRoute);
app.get("/agent/tasks", taskRoutes.listTasksRoute);
app.get("/agent/tasks/:id", taskRoutes.getTaskRoute);
app.patch("/agent/tasks/:id/status", taskRoutes.updateTaskStatusRoute);

app.post("/agent/events", eventRoutes.createEventRoute);
app.get("/agent/events", eventRoutes.getRecentEventsRoute);
app.get("/agent/tasks/:taskId/events", eventRoutes.getEventsByTaskRoute);

export default app;
