import type { Event, EventType } from "../../domain/event";
import type { EventRepository } from "../../infrastructure/db/event.repo";
import type { EventPort } from "../ports/event.port";

export class EventService implements EventPort {
	private repo: EventRepository;

	constructor(repo: EventRepository) {
		this.repo = repo;
	}

	async create(
		agentId: string | null,
		taskId: string,
		type: EventType,
		description: string,
		metadata?: Record<string, unknown>,
	): Promise<Event> {
		return this.repo.create(agentId, taskId, type, description, metadata || {});
	}

	async getByTask(taskId: string): Promise<Event[]> {
		return this.repo.getByTask(taskId);
	}

	async getRecent(limit?: number): Promise<Event[]> {
		return this.repo.getRecent(limit);
	}
}
