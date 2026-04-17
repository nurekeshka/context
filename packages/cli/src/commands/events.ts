import type { Command } from "commander";
import { ApiClient, type EventType } from "../client/api.ts";
import { requireConfig } from "../config/config.ts";

const EVENT_TYPES = ["action", "decision", "observation", "state_change", "coordination"] as const;

export function registerEventCommands(program: Command): void {
	const events = program
		.command("events")
		.description("Manage events");

	events
		.command("create")
		.description("Create a new event")
		.requiredOption("--task <id>", "Task ID")
		.requiredOption("--type <type>", "Event type")
		.requiredOption("--description <desc>", "Event description")
		.option("--metadata <json>", "Metadata as JSON string")
		.action(async (opts: { task: string; type: string; description: string; metadata?: string }) => {
			if (!EVENT_TYPES.includes(opts.type as EventType)) {
				console.error(`Invalid type '${opts.type}'. Must be one of: ${EVENT_TYPES.join(", ")}`);
				process.exit(1);
			}
			let metadata: Record<string, unknown> | undefined;
			if (opts.metadata) {
				try {
					metadata = JSON.parse(opts.metadata);
				} catch {
					console.error("Invalid JSON in --metadata");
					process.exit(1);
				}
			}
			const config = await requireConfig();
			const client = new ApiClient(config.serverUrl, config.token);
			const { event } = await client.createEvent({
				taskId: opts.task,
				type: opts.type as EventType,
				description: opts.description,
				metadata,
			});
			console.log(`Event created: ${event.type} (${event.id})`);
		});

	events
		.command("list")
		.description("List recent events")
		.option("--limit <n>", "Maximum number of events", "100")
		.action(async (opts: { limit: string }) => {
			const config = await requireConfig();
			const client = new ApiClient(config.serverUrl, config.token);
			const { events: list } = await client.listEvents(parseInt(opts.limit, 10));
			if (list.length === 0) {
				console.log("No events found.");
				return;
			}
			console.log(
				"ID".padEnd(38) + "TYPE".padEnd(16) + "DESCRIPTION".padEnd(40) + "CREATED",
			);
			console.log("─".repeat(38) + "─".repeat(16) + "─".repeat(40) + "─".repeat(20));
			for (const e of list) {
				console.log(
					e.id.padEnd(38) +
					e.type.padEnd(16) +
					e.description.slice(0, 38).padEnd(40) +
					(e.createdAt ?? ""),
				);
			}
		});

	events
		.command("by-task <taskId>")
		.description("List events for a specific task")
		.action(async (taskId: string) => {
			const config = await requireConfig();
			const client = new ApiClient(config.serverUrl, config.token);
			const { events: list } = await client.getTaskEvents(taskId);
			if (list.length === 0) {
				console.log("No events found for this task.");
				return;
			}
			console.log(
				"TYPE".padEnd(16) + "DESCRIPTION".padEnd(50) + "CREATED",
			);
			console.log("─".repeat(16) + "─".repeat(50) + "─".repeat(20));
			for (const e of list) {
				console.log(
					e.type.padEnd(16) +
					e.description.slice(0, 48).padEnd(50) +
					(e.createdAt ?? ""),
				);
			}
		});
}
