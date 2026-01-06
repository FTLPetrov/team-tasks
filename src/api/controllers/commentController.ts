import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../config/axios.config";
import type { Comment } from "../types/commentTypes";

export const commentKeys = {
  allComments: ["allComments"],
  commentDetails: (id: number) => [
    ...commentKeys.allComments,
    `commentDetails-${id}`,
  ],
};

export const useGetAllComments = () => {
  return useQuery<Comment[]>({
    queryKey: commentKeys.allComments,
    queryFn: async () => {
      const { data } = await axiosClient.get<Comment[]>(
        "https://jsonplaceholder.typicode.com/comments"
      );
      return data;
    },
  });
};
