import type { Component } from "../../domain/component";

export interface ComponentPort {
	create(name: string): Promise<Component>;
	delete(id: string): Promise<boolean>;
	list(): Promise<Component[]>;
}
