export type Component = {
	id: string;
	name: string;
	createdAt: string;
};

export type Agent = {
	id: string;
	name: string;
	createdAt: string;
};

export type Task = {
	id: string;
	componentId: string | null;
	name: string;
	description: string | null;
	status: string;
	createdAt: string;
};

export type Event = {
	id: string;
	agentId: string | null;
	taskId: string;
	type: string;
	description: string;
	metadata: Record<string, unknown>;
	createdAt: string;
};

export type TaskStatus = "open" | "in_progress" | "done" | "cancelled";
export type EventType = "action" | "decision" | "observation" | "state_change" | "coordination";

export class ApiError extends Error {
	constructor(
		public readonly status: number,
		public readonly body: unknown,
	) {
		const msg = typeof body === "object" && body && "error" in body
			? (body as { error: string }).error
			: `API error ${status}`;
		super(msg);
	}
}

export class ApiClient {
	constructor(
		private readonly baseUrl: string,
		private readonly token: string | null = null,
	) {}

	async login(token: string): Promise<{ agent: Agent }> {
		return this.request("/auth/login", {
			method: "POST",
			body: JSON.stringify({ token }),
		});
	}

	async createAgent(name: string, token: string): Promise<{ agent: Agent }> {
		return this.request("/admin/agents", {
			method: "POST",
			body: JSON.stringify({ name, token }),
		});
	}

	async listAgents(): Promise<{ agents: Agent[] }> {
		return this.request("/admin/agents");
	}

	async getAgent(id: string): Promise<{ agent: Agent }> {
		return this.request(`/admin/agents/${id}`);
	}

	async createComponent(name: string): Promise<{ component: Component }> {
		return this.request("/admin/components", {
			method: "POST",
			body: JSON.stringify({ name }),
		});
	}

	async listComponents(): Promise<{ components: Component[] }> {
		return this.request("/admin/components");
	}

	async deleteComponent(id: string): Promise<{ deleted: boolean }> {
		return this.request(`/admin/components/${id}`, { method: "DELETE" });
	}

	async createTask(params: {
		name: string;
		componentId?: string;
		description?: string;
	}): Promise<{ task: Task }> {
		return this.request("/agent/tasks", {
			method: "POST",
			body: JSON.stringify(params),
		});
	}

	async listTasks(componentId: string): Promise<{ tasks: Task[] }> {
		return this.request(`/agent/tasks?componentId=${encodeURIComponent(componentId)}`);
	}

	async getTask(id: string): Promise<{ task: Task; events: Event[] }> {
		return this.request(`/agent/tasks/${id}`);
	}

	async updateTaskStatus(id: string, status: TaskStatus): Promise<{ task: Task }> {
		return this.request(`/agent/tasks/${id}/status`, {
			method: "PATCH",
			body: JSON.stringify({ status }),
		});
	}

	async createEvent(params: {
		taskId: string;
		type: EventType;
		description: string;
		metadata?: Record<string, unknown>;
	}): Promise<{ event: Event }> {
		return this.request("/agent/events", {
			method: "POST",
			body: JSON.stringify(params),
		});
	}

	async listEvents(limit?: number): Promise<{ events: Event[] }> {
		const qs = limit ? `?limit=${limit}` : "";
		return this.request(`/agent/events${qs}`);
	}

	async getTaskEvents(taskId: string): Promise<{ events: Event[] }> {
		return this.request(`/agent/tasks/${taskId}/events`);
	}

	private async request<T>(path: string, options?: RequestInit): Promise<T> {
		const headers: Record<string, string> = { "Content-Type": "application/json" };
		if (this.token) headers["Authorization"] = `Bearer ${this.token}`;

		const res = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
		if (!res.ok) {
			const body = await res.json().catch(() => null);
			throw new ApiError(res.status, body);
		}
		return res.json() as Promise<T>;
	}
}
