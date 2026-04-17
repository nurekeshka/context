import { mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

export type Config = {
	serverUrl: string;
	token: string;
};

const CONFIG_DIR = join(homedir(), ".ctx");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");

export async function loadConfig(): Promise<Config | null> {
	const file = Bun.file(CONFIG_PATH);
	if (!(await file.exists())) return null;
	return file.json() as Promise<Config>;
}

export async function saveConfig(config: Config): Promise<void> {
	await mkdir(CONFIG_DIR, { recursive: true });
	await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export async function requireConfig(): Promise<Config> {
	const config = await loadConfig();
	if (!config) {
		console.error("Not configured. Run 'ctx login <token>' first.");
		process.exit(1);
	}
	return config;
}
