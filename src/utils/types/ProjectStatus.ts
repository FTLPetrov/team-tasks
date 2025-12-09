export const ProjectStatus = {
  ACTIVE: "Active",
  DONE: "Done",
  PAUSED: "Paused",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];
