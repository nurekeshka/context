import { AuthRepository } from "../../infrastructure/db/auth.repo";
import { db } from "../../infrastructure/db/drizzle";
import { EventRepository } from "../../infrastructure/db/event.repo";
import { TaskRepository } from "../../infrastructure/db/task.repo";
import { AuthService } from "./auth.service";
import { EventService } from "./event.service";
import { TaskService } from "./task.service";

const authRepo = new AuthRepository(db);
const eventRepo = new EventRepository(db);
const taskRepo = new TaskRepository(db);

export const authService = new AuthService(authRepo);
export const eventService = new EventService(eventRepo);
export const taskService = new TaskService(taskRepo);
