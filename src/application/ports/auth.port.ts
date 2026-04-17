import type { Agent, AgentToken } from "../../domain/agent";

export interface AuthPort {
	createAgent(name: string): Promise<Agent>;
	createToken(agentId: string, token: string): Promise<AgentToken>;
	getAgent(id: string): Promise<Agent | null>;
	hashPassword(password: string): Promise<string>;
	listAgents(): Promise<Agent[]>;
	validateToken(token: string): Promise<Agent | null>;
	verifyPassword(password: string, hash: string): Promise<boolean>;
}
