import type { ProjectStatus } from "../../utils/types/ProjectStatus";

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  teamIds: string[];
  adminIds: string[];
  memberIds: string[];
  status: ProjectStatus;
}
