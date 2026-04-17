export type Task = {
	id: string;
	componentId: string | null;
	name: string;
	description: string | null;
	status: string | null;
	createdAt: Date | null;
};
