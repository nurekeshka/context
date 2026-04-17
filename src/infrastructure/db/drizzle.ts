import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "../../config";
import { log } from "../../logger";
import * as schema from "./schema";

const client = postgres(config.DATABASE_URL);

log.db(config.DATABASE_URL);

export const db = drizzle(client, { schema });

export type Database = typeof db;
