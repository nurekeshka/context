export type Admin = {
	id: string;
	username: string;
	passwordHash: string;
	createdAt: Date | null;
};

export type Agent = {
	id: string;
	name: string;
	createdAt: Date | null;
};

export type AgentToken = {
	id: string;
	agentId: string;
	tokenHash: string;
	createdAt: Date | null;
};

export type Component = {
	id: string;
	name: string;
	createdAt: Date | null;
};

export type Task = {
	id: string;
	componentId: string | null;
	name: string;
	description: string | null;
	status: string;
	createdAt: Date | null;
};

export type Event = {
	id: string;
	agentId: string | null;
	taskId: string;
	type: string;
	description: string;
	metadata: Record<string, unknown>;
	createdAt: Date | null;
};
