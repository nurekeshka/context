import type { Command } from "commander";
import { ApiClient } from "../client/api.ts";
import { loadConfig, saveConfig } from "../config/config.ts";

export function registerAuthCommands(program: Command): void {
	program
		.command("login <token>")
		.description("Validate token and save credentials")
		.option("--url <url>", "Server URL", "http://localhost:3000")
		.action(async (token: string, opts: { url: string }) => {
			const client = new ApiClient(opts.url);
			const { agent } = await client.login(token);
			await saveConfig({ serverUrl: opts.url, token });
			console.log(`Logged in as ${agent.name} (${agent.id})`);
		});

	const config = program
		.command("config")
		.description("Manage CLI configuration");

	config
		.command("set-url <url>")
		.description("Set the ctx server URL")
		.action(async (url: string) => {
			const existing = await loadConfig();
			await saveConfig({ serverUrl: url, token: existing?.token ?? "" });
			console.log(`Server URL set to ${url}`);
		});

	config
		.command("show")
		.description("Show current configuration")
		.action(async () => {
			const existing = await loadConfig();
			if (!existing) {
				console.log("No configuration found. Run 'ctx login <token>' first.");
				return;
			}
			console.log(`Server URL: ${existing.serverUrl}`);
			console.log(`Token:      ${existing.token.slice(0, 8)}...`);
		});
}
