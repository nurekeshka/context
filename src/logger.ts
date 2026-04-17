import pino from "pino";
import { config } from "./config";

export const logger = pino({
	level: config.LOG_LEVEL,
	...(config.LOG_PRETTY && {
		transport: {
			options: {
				colorize: true,
				ignore: "pid,hostname",
				translateTime: "SYS:standard",
			},
			target: "pino-pretty",
		},
	}),
});

export const log = {
	agent: {
		created: (name: string, id: string) => logger.info(`creating agent: ${name} (${id})`),
		login: (id: string, success: boolean) => logger.info(`agent login: ${id} (${success ? "success" : "failure"})`),
		retrieved: (id: string) => logger.info(`retrieving agent: ${id}`),
	},
	db: (url: string) => logger.info(`database connection is open to: ${url}`),
	event: {
		created: (taskId: string, type: string, id: string) =>
			logger.info(`creating event: ${type} on ${taskId} (${id})`),
		retrieved: (taskId: string, count: number) =>
			logger.info(`retrieving events for task: ${taskId} (${count} found)`),
	},
	request: (method: string, path: string, status: number, duration: number) =>
		logger.info({ duration, method, path, status }, `request: ${method} ${path} -> ${status}`),
	server: (port: number, hostname: string) => logger.info(`server is up on: http://${hostname}:${port}`),
	task: {
		created: (name: string, id: string) => logger.info(`creating task: ${name} (${id})`),
		retrieved: (id: string) => logger.info(`retrieving task: ${id}`),
		updated: (id: string, status: string) => logger.info(`updating task: ${id} to ${status}`),
	},
};
