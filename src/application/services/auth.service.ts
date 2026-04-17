import { hash, verify } from "@node-rs/argon2";
import type { Agent, AgentToken } from "../../domain/agent";
import type { AuthRepository } from "../../infrastructure/db/auth.repo";
import type { AuthPort } from "../ports/auth.port";

export class AuthService implements AuthPort {
	private repo: AuthRepository;

	constructor(repo: AuthRepository) {
		this.repo = repo;
	}

	async createAgent(name: string): Promise<Agent> {
		return this.repo.createAgent(name);
	}

	async createToken(agentId: string, token: string): Promise<AgentToken> {
		const tokenHash = await hash(token);
		return this.repo.createToken(agentId, tokenHash);
	}

	async validateToken(token: string): Promise<Agent | null> {
		const tokens = await this.repo.findAllTokens();
		for (const t of tokens) {
			const isValid = await verify(t.tokenHash, token);
			if (isValid) {
				return this.repo.getAgent(t.agentId);
			}
		}
		return null;
	}

	async listAgents(): Promise<Agent[]> {
		return this.repo.listAgents();
	}

	async getAgent(id: string): Promise<Agent | null> {
		return this.repo.getAgent(id);
	}

	async hashPassword(password: string): Promise<string> {
		return hash(password);
	}

	async verifyPassword(hash: string, password: string): Promise<boolean> {
		return verify(hash, password);
	}
}
