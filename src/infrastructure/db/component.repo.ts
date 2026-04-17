import { eq } from "drizzle-orm";
import type { Component } from "../../domain/component";
import type { Database } from "./drizzle";
import { components } from "./schema";

export class ComponentRepository {
	constructor(private db: Database) {}

	async create(name: string): Promise<Component> {
		const [component] = await this.db.insert(components).values({ name }).returning();
		if (!component) throw new Error("Failed to create component");
		return component as Component;
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.db.delete(components).where(eq(components.id, id)).returning();
		return result.length > 0;
	}

	async list(): Promise<Component[]> {
		const result = await this.db.select().from(components);
		return result as Component[];
	}
}
