import type { TaskPriority } from "./TaskPriority";
import type { TaskStatus } from "./TaskStatus";

export type Filters = {
  title: string;
  description: string;
  status: TaskStatus | "";
  priority: TaskPriority | "";
  assignedIds: string[];
};
