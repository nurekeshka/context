import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const admins = pgTable("admins", {
	createdAt: timestamp("created_at").defaultNow(),
	id: uuid("id").primaryKey().defaultRandom(),
	passwordHash: text("password_hash").notNull(),
	username: text("username").unique().notNull(),
});

export const agents = pgTable("agents", {
	createdAt: timestamp("created_at").defaultNow(),
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
});

export const agentTokens = pgTable("agent_tokens", {
	agentId: uuid("agent_id")
		.references(() => agents.id, { onDelete: "cascade" })
		.notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	id: uuid("id").primaryKey().defaultRandom(),
	tokenHash: text("token_hash").notNull(),
});

export const components = pgTable("components", {
	createdAt: timestamp("created_at").defaultNow(),
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
});

export const tasks = pgTable("tasks", {
	componentId: uuid("component_id").references(() => components.id, {
		onDelete: "cascade",
	}),
	createdAt: timestamp("created_at").defaultNow(),
	description: text("description"),
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	status: text("status").default("open"),
});

export const events = pgTable("events", {
	agentId: uuid("agent_id").references(() => agents.id, {
		onDelete: "set null",
	}),
	createdAt: timestamp("created_at").defaultNow(),
	description: text("description").notNull(),
	id: uuid("id").primaryKey().defaultRandom(),
	metadata: jsonb("metadata").default({}),
	taskId: uuid("task_id")
		.references(() => tasks.id, { onDelete: "cascade" })
		.notNull(),
	type: text("type").notNull(),
});

export type Admin = typeof admins.$inferSelect;
export type Agent = typeof agents.$inferSelect;
export type AgentToken = typeof agentTokens.$inferSelect;
export type Component = typeof components.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Event = typeof events.$inferSelect;
