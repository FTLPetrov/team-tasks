export interface Project {
  id: number;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  teamIds: number[];
  adminIds: number[];
  memberIds: number[];
  status: ProjectStatus;
  posts: number[];
}

export const ProjectStatus = {
  ACTIVE: "Active",
  DONE: "Done",
  PAUSED: "Paused",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];