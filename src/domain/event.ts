export type EventType = "action" | "decision" | "observation" | "state_change" | "coordination";

export type Event = {
	id: string;
	agentId: string | null;
	taskId: string;
	type: EventType;
	description: string;
	metadata: Record<string, unknown>;
	createdAt: Date | null;
};
