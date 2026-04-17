import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ApiClient } from "../client/api.ts";

export function registerResources(server: McpServer, client: ApiClient): void {
	server.resource(
		"task",
		new ResourceTemplate("ctx://tasks/{taskId}", { list: undefined }),
		async (uri, { taskId }) => {
			const result = await client.getTask(taskId as string);
			return {
				contents: [{
					uri: uri.href,
					mimeType: "application/json",
					text: JSON.stringify(result, null, 2),
				}],
			};
		},
	);

	server.resource(
		"recent-events",
		"ctx://events/recent",
		async (uri) => {
			const { events } = await client.listEvents(100);
			return {
				contents: [{
					uri: uri.href,
					mimeType: "application/json",
					text: JSON.stringify(events, null, 2),
				}],
			};
		},
	);
}
