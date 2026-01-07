import { useMutation, useQuery } from "@tanstack/react-query";
import type { Task } from "../types/taskTypes";
import { axiosClient } from "../../config/axios.config";
import { queryClient } from "../../config/queryClient.config";

export const taskKeys = {
  allTasks: ["allTasks"],
  taskDetails: (id: number) => [...taskKeys.allTasks, `taskDetails-${id}`],
};

export const useGetAllTasks = () => {
  return useQuery<Task[]>({
    queryKey: taskKeys.allTasks,
    queryFn: async () => {
      const { data } = await axiosClient.get<Task[]>("/tasks");
      return data;
    },
  });
};

export const useGetTaskById = (id: number) => {
  return useQuery<Task>({
    queryKey: taskKeys.taskDetails(id),
    queryFn: async () => {
      const { data } = await axiosClient.get<Task>(`/tasks/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  return useMutation({
    mutationFn: async (task: Partial<Task>) => {
      const response = await axiosClient.post("/tasks", task);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.allTasks });
    },
  });
};

export const useUpdateTask = (taskId: number) => {
  return useMutation({
    mutationFn: async (task: Partial<Task>) => {
      const response = await axiosClient.put(`/tasks/${taskId}`, task);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.allTasks });
    },
  });
};

export const useDeleteTask = (taskId: number) => {
  return useMutation({
    mutationFn: async () => {
      const response = await axiosClient.delete(`/tasks/${taskId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.allTasks });
    },
  });
};
