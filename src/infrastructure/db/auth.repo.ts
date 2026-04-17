import { eq } from "drizzle-orm";
import type { Agent, AgentToken as AgentTokenType } from "../../domain/agent";
import type { Database } from "./drizzle";
import { agents, agentTokens } from "./schema";

export class AuthRepository {
	constructor(private db: Database) {}

	async createAgent(name: string): Promise<Agent> {
		const [agent] = await this.db.insert(agents).values({ name }).returning();
		if (!agent) throw new Error("Failed to create agent");
		return agent;
	}

	async getAgent(id: string): Promise<Agent | null> {
		const [agent] = await this.db.select().from(agents).where(eq(agents.id, id)).limit(1);
		return agent ?? null;
	}

	async getAgentByName(name: string): Promise<Agent | null> {
		const [agent] = await this.db.select().from(agents).where(eq(agents.name, name)).limit(1);
		return agent ?? null;
	}

	async listAgents(): Promise<Agent[]> {
		return this.db.select().from(agents);
	}

	async createToken(agentId: string, tokenHash: string): Promise<AgentTokenType> {
		const [token] = await this.db.insert(agentTokens).values({ agentId, tokenHash }).returning();
		if (!token) throw new Error("Failed to create token");
		return token;
	}

	async findTokenByHash(tokenHash: string): Promise<AgentTokenType | null> {
		const [token] = await this.db.select().from(agentTokens).where(eq(agentTokens.tokenHash, tokenHash)).limit(1);
		return token ?? null;
	}

	async findAllTokens(): Promise<AgentTokenType[]> {
		return this.db.select().from(agentTokens);
	}
}
