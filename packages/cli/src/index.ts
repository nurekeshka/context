#!/usr/bin/env bun
import { Command } from "commander";
import { ApiError } from "./client/api.ts";
import { registerAuthCommands } from "./commands/auth.ts";
import { registerAgentCommands } from "./commands/agents.ts";
import { registerComponentCommands } from "./commands/components.ts";
import { registerTaskCommands } from "./commands/tasks.ts";
import { registerEventCommands } from "./commands/events.ts";

const program = new Command();

program
	.name("ctx")
	.description("CLI for the ctx event-driven agent coordination platform")
	.version("1.0.0");

registerAuthCommands(program);
registerAgentCommands(program);
registerComponentCommands(program);
registerTaskCommands(program);
registerEventCommands(program);

program.parseAsync(process.argv).catch((err) => {
	if (err instanceof ApiError) {
		console.error(`Error ${err.status}: ${err.message}`);
	} else {
		console.error(err instanceof Error ? err.message : String(err));
	}
	process.exit(1);
});
