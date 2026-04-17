import type { Command } from "commander";
import { ApiClient } from "../client/api.ts";
import { loadConfig } from "../config/config.ts";

function getBaseUrl(opts: { url?: string }, config: { serverUrl: string } | null): string {
	return opts.url ?? config?.serverUrl ?? "http://localhost:3000";
}

export function registerAgentCommands(program: Command): void {
	const agents = program
		.command("agents")
		.description("Manage agents (admin)");

	agents
		.command("create <name>")
		.description("Create a new agent")
		.requiredOption("--token <token>", "Agent authentication token")
		.option("--url <url>", "Server URL (overrides config)")
		.action(async (name: string, opts: { token: string; url?: string }) => {
			const config = await loadConfig();
			const client = new ApiClient(getBaseUrl(opts, config));
			const { agent } = await client.createAgent(name, opts.token);
			console.log(`Agent created: ${agent.name} (${agent.id})`);
		});

	agents
		.command("list")
		.description("List all agents")
		.option("--url <url>", "Server URL (overrides config)")
		.action(async (opts: { url?: string }) => {
			const config = await loadConfig();
			const client = new ApiClient(getBaseUrl(opts, config));
			const { agents: list } = await client.listAgents();
			if (list.length === 0) {
				console.log("No agents found.");
				return;
			}
			console.log(
				"ID".padEnd(38) + "NAME".padEnd(20) + "CREATED",
			);
			console.log("─".repeat(38) + "─".repeat(20) + "─".repeat(20));
			for (const a of list) {
				console.log(
					a.id.padEnd(38) +
					a.name.padEnd(20) +
					(a.createdAt ?? ""),
				);
			}
		});

	agents
		.command("get <id>")
		.description("Get agent details")
		.option("--url <url>", "Server URL (overrides config)")
		.action(async (id: string, opts: { url?: string }) => {
			const config = await loadConfig();
			const client = new ApiClient(getBaseUrl(opts, config));
			const { agent } = await client.getAgent(id);
			console.log(JSON.stringify(agent, null, 2));
		});
}
