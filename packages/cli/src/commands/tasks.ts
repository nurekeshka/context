import type { Command } from "commander";
import { ApiClient, type TaskStatus } from "../client/api.ts";
import { requireConfig } from "../config/config.ts";

export function registerTaskCommands(program: Command): void {
	const tasks = program
		.command("tasks")
		.description("Manage tasks");

	tasks
		.command("create <name>")
		.description("Create a new task")
		.option("--component <id>", "Component ID")
		.option("--description <desc>", "Task description")
		.action(async (name: string, opts: { component?: string; description?: string }) => {
			const config = await requireConfig();
			const client = new ApiClient(config.serverUrl, config.token);
			const { task } = await client.createTask({
				name,
				componentId: opts.component,
				description: opts.description,
			});
			console.log(`Task created: ${task.name} (${task.id})`);
		});

	tasks
		.command("list")
		.description("List tasks by component")
		.requiredOption("--component <id>", "Component ID")
		.action(async (opts: { component: string }) => {
			const config = await requireConfig();
			const client = new ApiClient(config.serverUrl, config.token);
			const { tasks: list } = await client.listTasks(opts.component);
			if (list.length === 0) {
				console.log("No tasks found.");
				return;
			}
			console.log(
				"ID".padEnd(38) + "NAME".padEnd(30) + "STATUS".padEnd(14) + "CREATED",
			);
			console.log("─".repeat(38) + "─".repeat(30) + "─".repeat(14) + "─".repeat(20));
			for (const t of list) {
				console.log(
					t.id.padEnd(38) +
					t.name.slice(0, 28).padEnd(30) +
					(t.status ?? "").padEnd(14) +
					(t.createdAt ?? ""),
				);
			}
		});

	tasks
		.command("get <id>")
		.description("Get task with event history")
		.action(async (id: string) => {
			const config = await requireConfig();
			const client = new ApiClient(config.serverUrl, config.token);
			const { task, events } = await client.getTask(id);
			console.log(`Task: ${task.name} [${task.status}]`);
			console.log(`ID:        ${task.id}`);
			console.log(`Component: ${task.componentId ?? "none"}`);
			if (task.description) console.log(`Desc:      ${task.description}`);
			console.log(`Created:   ${task.createdAt ?? ""}`);
			console.log();
			if (events.length === 0) {
				console.log("No events.");
				return;
			}
			console.log(`Events (${events.length}):`);
			console.log(
				"TYPE".padEnd(16) + "DESCRIPTION".padEnd(50) + "CREATED",
			);
			console.log("─".repeat(16) + "─".repeat(50) + "─".repeat(20));
			for (const e of events) {
				console.log(
					e.type.padEnd(16) +
					e.description.slice(0, 48).padEnd(50) +
					(e.createdAt ?? ""),
				);
			}
		});

	tasks
		.command("update-status <id> <status>")
		.description("Update task status")
		.addHelpText("after", "\nValid statuses: open, in_progress, done, cancelled")
		.action(async (id: string, status: string) => {
			const valid = ["open", "in_progress", "done", "cancelled"];
			if (!valid.includes(status)) {
				console.error(`Invalid status '${status}'. Must be one of: ${valid.join(", ")}`);
				process.exit(1);
			}
			const config = await requireConfig();
			const client = new ApiClient(config.serverUrl, config.token);
			const { task } = await client.updateTaskStatus(id, status as TaskStatus);
			console.log(`Task ${task.id} status updated to: ${task.status}`);
		});
}
