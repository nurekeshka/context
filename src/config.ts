import "dotenv/config";
import { z } from "zod";

const configSchema = z.object({
	DATABASE_URL: z.string().min(1),
	LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
	LOG_PRETTY: z.boolean().default(true),
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

type Config = z.infer<typeof configSchema> & { PORT: number };

const parseConfig = (): Config => {
	const result = configSchema.safeParse(process.env);
	if (!result.success) {
		console.error("Invalid environment variables:");
		console.error(result.error.flatten().fieldErrors);
		process.exit(1);
	}
	const port = parseInt(process.env.PORT || "3000", 10);
	if (Number.isNaN(port)) {
		console.error("PORT must be a valid number");
		process.exit(1);
	}
	return { ...result.data, PORT: port };
};

export const config = parseConfig();
