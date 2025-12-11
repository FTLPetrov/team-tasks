import type { TaskPriority } from "../../utils/types/TaskPriority";
import type { TaskStatus } from "../../utils/types/TaskStatus";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedUserId: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
}
