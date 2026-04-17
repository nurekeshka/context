import type { Command } from "commander";
import { ApiClient } from "../client/api.ts";
import { loadConfig } from "../config/config.ts";

function getBaseUrl(opts: { url?: string }, config: { serverUrl: string } | null): string {
	return opts.url ?? config?.serverUrl ?? "http://localhost:3000";
}

export function registerComponentCommands(program: Command): void {
	const components = program
		.command("components")
		.description("Manage components (admin)");

	components
		.command("create <name>")
		.description("Create a new component")
		.option("--url <url>", "Server URL (overrides config)")
		.action(async (name: string, opts: { url?: string }) => {
			const config = await loadConfig();
			const client = new ApiClient(getBaseUrl(opts, config));
			const { component } = await client.createComponent(name);
			console.log(`Component created: ${component.name} (${component.id})`);
		});

	components
		.command("list")
		.description("List all components")
		.option("--url <url>", "Server URL (overrides config)")
		.action(async (opts: { url?: string }) => {
			const config = await loadConfig();
			const client = new ApiClient(getBaseUrl(opts, config));
			const { components: list } = await client.listComponents();
			if (list.length === 0) {
				console.log("No components found.");
				return;
			}
			console.log(
				"ID".padEnd(38) + "NAME".padEnd(20) + "CREATED",
			);
			console.log("─".repeat(38) + "─".repeat(20) + "─".repeat(20));
			for (const c of list) {
				console.log(
					c.id.padEnd(38) +
					c.name.padEnd(20) +
					(c.createdAt ?? ""),
				);
			}
		});

	components
		.command("delete <id>")
		.description("Delete a component")
		.option("--url <url>", "Server URL (overrides config)")
		.action(async (id: string, opts: { url?: string }) => {
			const config = await loadConfig();
			const client = new ApiClient(getBaseUrl(opts, config));
			await client.deleteComponent(id);
			console.log(`Component deleted: ${id}`);
		});
}
