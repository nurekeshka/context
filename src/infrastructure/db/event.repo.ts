import { desc, eq } from "drizzle-orm";
import type { Event, EventType } from "../../domain/event";
import type { Database } from "./drizzle";
import { events } from "./schema";

export class EventRepository {
	constructor(private db: Database) {}

	async create(
		agentId: string | null,
		taskId: string,
		type: EventType,
		description: string,
		metadata: Record<string, unknown> = {},
	): Promise<Event> {
		const [event] = await this.db
			.insert(events)
			.values({ agentId, description, metadata, taskId, type })
			.returning();
		if (!event) throw new Error("Failed to create event");
		return event as Event;
	}

	async getByTask(taskId: string): Promise<Event[]> {
		const result = await this.db
			.select()
			.from(events)
			.where(eq(events.taskId, taskId))
			.orderBy(desc(events.createdAt));
		return result as Event[];
	}

	async getRecent(limit: number = 100): Promise<Event[]> {
		const result = await this.db.select().from(events).orderBy(desc(events.createdAt)).limit(limit);
		return result as Event[];
	}
}
