import { axiosClient } from "../../config/axios.config";
import type { User, CreateUserInput } from "../types/userTypes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const userKeys = {
  allUsers: "allUsers",
  userDetails: (userId?: number) => [
    userKeys.allUsers,
    `userDetails-${userId}`,
  ],
};

export const useGetAllUsers = () => {
  return useQuery<User[]>({
    queryKey: [userKeys.allUsers],
    queryFn: async () => {
      const { data } = await axiosClient.get<User[]>("/users");
      return data;
    },
  });
};

export const useGetUser = (userId: number | undefined) => {
  return useQuery<User>({
    queryKey: userKeys.userDetails(userId),
    queryFn: async () => {
      const { data } = await axiosClient.get<User>(`/users/${userId}`);
      return data;
    },
    enabled: typeof userId === "number",
  });
};

// NEW: create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, unknown, CreateUserInput>({
    mutationFn: async (newUser: CreateUserInput) => {
      const { data } = await axiosClient.post<User>("/users", newUser);
      return data;
    },
    onSuccess: () => {
      // refresh the users list if it’s in use anywhere
      queryClient.invalidateQueries({ queryKey: [userKeys.allUsers] });
    },
  });
};
