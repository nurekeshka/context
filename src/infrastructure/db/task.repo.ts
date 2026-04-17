import { eq } from "drizzle-orm";
import type { Task } from "../../domain/task";
import type { Database } from "./drizzle";
import { tasks } from "./schema";

export class TaskRepository {
	constructor(private db: Database) {}

	async create(componentId: string | null, name: string, description?: string): Promise<Task> {
		const [task] = await this.db.insert(tasks).values({ componentId, description, name }).returning();
		if (!task) throw new Error("Failed to create task");
		return task as Task;
	}

	async getByComponent(componentId: string): Promise<Task[]> {
		const result = await this.db.select().from(tasks).where(eq(tasks.componentId, componentId));
		return result as Task[];
	}

	async getById(id: string): Promise<Task | null> {
		const [task] = await this.db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
		return (task as Task) ?? null;
	}

	async updateStatus(id: string, status: string): Promise<Task | null> {
		const [task] = await this.db.update(tasks).set({ status }).where(eq(tasks.id, id)).returning();
		return (task as Task) ?? null;
	}
}
