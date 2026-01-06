import { useMutation, useQuery } from "@tanstack/react-query";
import type { Project } from "../types/projectTypes";
import { axiosClient } from "../../config/axios.config";
import { queryClient } from "../../config/queryClient.config";

export const projectKeys = {
  allProjects: ["allProjects"],
  projectDetails: (id: number) => [
    ...projectKeys.allProjects,
    `projectDetails-${id}`,
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

export const useGetProjectById = (id: number) => {
  return useQuery<Project>({
    queryKey: projectKeys.projectDetails(id),
    queryFn: async () => {
      const { data } = await axiosClient.get<Project>(`/projects/${id}`);
      return data;
    },
    enabled: !!id,
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

export const useUpdateProject = (projectId: number) => {
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

export const useDeleteProject = (projectId: number) => {
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
