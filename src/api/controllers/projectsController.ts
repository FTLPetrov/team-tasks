import { useMutation, useQuery } from "@tanstack/react-query";
import type { Project } from "../types/projectTypes";
import { axiosClient } from "../../config/axios.config";
import { queryClient } from "../../config/queryClient.config";

export const projectKeys = {
  allProjects: ["allProjects"],
  projectDetails: (projectId: string) => [
    projectKeys.allProjects,
    `projectDetails-${projectId}`,
  ],
};

export const useGetAllProjects = () => {
  return useQuery<Project[]>({
    queryKey: projectKeys.allProjects,
    queryFn: async () => {
      const { data } = await axiosClient.get<Project[]>("/projects");
      return data;
    },
  });
};

export const useGetProjectById = (projectId: string) => {
  return useQuery<Project>({
    queryKey: projectKeys.projectDetails(projectId),
    queryFn: async () => {
      const { data } = await axiosClient.get<Project>(`/projects/${projectId}`);
      return data;
    },
    enabled: !!projectId,
  });
};

export const useCreateProject = () => {
  return useMutation({
    mutationFn: async (project: Partial<Project>) => {
      const response = await axiosClient.post("/projects", project);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.allProjects });
    },
  });
};

export const useUpdateProject = (projectId: string) => {
  return useMutation({
    mutationFn: async (project: Partial<Project>) => {
      const response = await axiosClient.put(`/projects/${projectId}`, project);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.allProjects });
    },
  });
};

export const useDeleteProject = (projectId: string) => {
  return useMutation({
    mutationFn: async () => {
      const response = await axiosClient.delete(`/projects/${projectId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.allProjects });
    },
  });
};
