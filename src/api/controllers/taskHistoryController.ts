import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../config/axios.config";
import { queryClient } from "../../config/queryClient.config";
import type {
  CreateTaskHistoryInput,
  TaskHistoryEntry,
} from "../types/taskTypes";

export const taskHistoryKeys = {
  allHistory: ["taskHistory"] as const,
};

export const useGetAllTaskHistory = () => {
  return useQuery<TaskHistoryEntry[]>({
    queryKey: taskHistoryKeys.allHistory,
    queryFn: async () => {
      const { data } = await axiosClient.get<TaskHistoryEntry[]>(
        "/taskHistory"
      );
      return data;
    },
  });
};

export const useCreateTaskHistory = () => {
  return useMutation<TaskHistoryEntry, unknown, CreateTaskHistoryInput>({
    mutationFn: async (payload) => {
      const { data } = await axiosClient.post<TaskHistoryEntry>(
        "/taskHistory",
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskHistoryKeys.allHistory });
    },
  });
};
