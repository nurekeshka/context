import type { Event, EventType } from "../../domain/event";

export interface EventPort {
	create(
		agentId: string | null,
		taskId: string,
		type: EventType,
		description: string,
		metadata?: Record<string, unknown>,
	): Promise<Event>;
	getByTask(taskId: string): Promise<Event[]>;
	getRecent(limit?: number): Promise<Event[]>;
}
