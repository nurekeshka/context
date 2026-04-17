import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dbCredentials: {
		url: process.env.DATABASE_URL || "postgres://localhost:5432/ctx",
	},
	dialect: "postgresql",
	out: "./drizzle",
	schema: "./src/infrastructure/db/schema.ts",
});
