export const TaskStatus = {
  TODO: "Todo",
  IN_PROGRESS: "In-progress",
  COMPLETED: "Completed",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
