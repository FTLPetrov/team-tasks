import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../config/axios.config";
import type { Post } from "../types/postTypes";

export const postKeys = {
  allPosts: ["allPosts"],
  postDetails: (id: number) => [...postKeys.allPosts, `postDetails-${id}`],
};

export const useGetAllPosts = () => {
  return useQuery<Post[]>({
    queryKey: postKeys.allPosts,
    queryFn: async () => {
      const { data } = await axiosClient.get<Post[]>(
        "https://jsonplaceholder.typicode.com/posts"
      );
      return data;
    },
  });
};
