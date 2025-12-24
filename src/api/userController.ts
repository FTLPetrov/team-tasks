import { axiosClient } from "../config/axios.config";
import { queryClient } from "../config/queryClient.config";
import type { User } from "./userTypes";
import { useMutation, useQuery } from "@tanstack/react-query";

export const userKeys = {
  allUsers: ["allUsers"],
  userDetails: (userId: number) => [userKeys.allUsers, `userDetails-${userId}`],
};

export const useGetAllUsers = () => {
  return useQuery<User[]>({
    queryKey: [userKeys.allUsers],
    queryFn: async () => {
      const { data } = await axiosClient.get<User[]>(`/users`);
      return data;
    },
  });
};

export const useGetUserById = (userId: number) => {
  return useQuery<User>({
    queryKey: userKeys.userDetails(userId),
    queryFn: async () => {
      const { data } = await axiosClient.get<User>(`/users/${userId}`);
      return data;
    },
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (user: Partial<User>) => {
      const response = await axiosClient.post<User>("/users", user);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.allUsers });
    },
  });
};

export const useUpdateUser = (userId: number) => {
  return useMutation({
    mutationFn: async (user: Partial<User>) => {
      const currentUser = await axiosClient.get<User>(`/users/${userId}`);
      const response = await axiosClient.put<User>(`/users/${userId}`, {
        ...currentUser.data,
        ...user,
        createdAt: currentUser.data.createdAt,
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.userDetails(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.allUsers });
    },
  });
};

export const useDeleteUser = (userId: number) => {
  return useMutation({
    mutationFn: async () => {
      await axiosClient.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.allUsers });
    },
  });
};
