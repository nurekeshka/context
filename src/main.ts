import "./config";

import { serve } from "@hono/node-server";
import { config } from "./config";
import { app } from "./interfaces/http/app";
import { log } from "./logger";

void (() => {
	log.server(config.PORT, "localhost");
	serve({ fetch: app.fetch, port: config.PORT });
})();
