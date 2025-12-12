export const TaskStatus = {
  TODO: "Todo",
  IN_PROGRESS: "In-progress",
  COMPLETED: "Comleted",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
