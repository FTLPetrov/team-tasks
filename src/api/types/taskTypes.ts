export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedUserId: number;
  createdAt: string;
  updatedAt: string;
  projectId: number;
  startDate?: string | null;
  dueDate?: string | null;
  completedAt?: string | null;
}

export const TaskStatus = {
  TODO: "Todo",
  IN_PROGRESS: "In-progress",
  COMPLETED: "Comleted",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
} as const;

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export type TaskHistoryField = keyof Task;

export interface TaskHistoryDiff {
  field: TaskHistoryField;
  previousValue: string | number | null;
  nextValue: string | number | null;
}

export interface TaskHistoryEntry {
  id: number;
  taskId: number;
  createdAt: string;
  createdBy: number;
  beforeSnapshot: Task;
  afterSnapshot: Task;
  diff: TaskHistoryDiff[];
}

export type CreateTaskHistoryInput = Omit<TaskHistoryEntry, "id">;
