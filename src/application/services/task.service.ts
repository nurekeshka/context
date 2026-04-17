import type { Task } from "../../domain/task";
import type { TaskRepository } from "../../infrastructure/db/task.repo";
import type { TaskPort } from "../ports/task.port";

export class TaskService implements TaskPort {
	private repo: TaskRepository;

	constructor(repo: TaskRepository) {
		this.repo = repo;
	}

	async create(componentId: string | null, name: string, description?: string): Promise<Task> {
		return this.repo.create(componentId, name, description);
	}

	async getByComponent(componentId: string): Promise<Task[]> {
		return this.repo.getByComponent(componentId);
	}

	async getById(id: string): Promise<Task | null> {
		return this.repo.getById(id);
	}

	async updateStatus(id: string, status: string): Promise<Task | null> {
		return this.repo.updateStatus(id, status);
	}
}
