export const TaskPriority = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
} as const;

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];
