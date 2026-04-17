import type { Component } from "../../domain/component";
import type { ComponentRepository } from "../../infrastructure/db/component.repo";
import type { ComponentPort } from "../ports/component.port";

export class ComponentService implements ComponentPort {
	private repo: ComponentRepository;

	constructor(repo: ComponentRepository) {
		this.repo = repo;
	}

	async create(name: string): Promise<Component> {
		return this.repo.create(name);
	}

	async delete(id: string): Promise<boolean> {
		return this.repo.delete(id);
	}

	async list(): Promise<Component[]> {
		return this.repo.list();
	}
}
