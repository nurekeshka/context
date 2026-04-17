import type { Task } from "../../domain/task";

export interface TaskPort {
	create(componentId: string | null, name: string, description?: string): Promise<Task>;
	getByComponent(componentId: string): Promise<Task[]>;
	getById(id: string): Promise<Task | null>;
	updateStatus(id: string, status: string): Promise<Task | null>;
}
