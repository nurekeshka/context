#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ApiClient } from "./client/api.ts";
import { requireConfig } from "./config/config.ts";
import { registerTools } from "./mcp/tools.ts";
import { registerResources } from "./mcp/resources.ts";

async function main() {
	const config = await requireConfig();
	const client = new ApiClient(config.serverUrl, config.token);

	const server = new McpServer({
		name: "ctx",
		version: "1.0.0",
	});

	registerTools(server, client);
	registerResources(server, client);

	const transport = new StdioServerTransport();
	await server.connect(transport);
}

main().catch((err) => {
	process.stderr.write(`ctx-mcp error: ${err}\n`);
	process.exit(1);
});
