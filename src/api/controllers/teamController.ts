import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../config/axios.config";
import { queryClient } from "../../config/queryClient.config";
import type { CreateTeamDto, Team, UpdateTeamDto } from "../types/teamTypes";

type UpdateTeamPayload = {
  teamId: number;
  data: UpdateTeamDto;
};

type DeleteTeamPayload = {
  teamId: number;
};

export const teamKeys = {
  allTeams: ["teams"] as const,
  teamDetails: (teamId?: number) => ["teams", teamId] as const,
};

export const useGetAllTeams = () =>
  useQuery<Team[]>({
    queryKey: teamKeys.allTeams,
    queryFn: async () => {
      const { data } = await axiosClient.get<Team[]>("/teams");
      return data;
    },
  });

export const useGetTeam = (teamId?: number) =>
  useQuery<Team>({
    queryKey: teamKeys.teamDetails(teamId),
    queryFn: async () => {
      const { data } = await axiosClient.get<Team>(`/teams/${teamId}`);
      return data;
    },
    enabled: typeof teamId === "number",
  });

export const useCreateTeam = () =>
  useMutation({
    mutationFn: async (payload: CreateTeamDto) => {
      const { data } = await axiosClient.post<Team>("/teams", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
    },
  });

export const useUpdateTeam = () =>
  useMutation({
    mutationFn: async ({ teamId, data }: UpdateTeamPayload) => {
      const response = await axiosClient.patch<Team>(`/teams/${teamId}`, data);
      return response.data;
    },
    onSuccess: (_data, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
      queryClient.invalidateQueries({
        queryKey: teamKeys.teamDetails(teamId),
      });
    },
  });

export const useDeleteTeam = () =>
  useMutation({
    mutationFn: async ({ teamId }: DeleteTeamPayload) => {
      await axiosClient.delete(`/teams/${teamId}`);
      return teamId;
    },
    onSuccess: (teamId) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
      queryClient.invalidateQueries({
        queryKey: teamKeys.teamDetails(teamId),
      });
    },
  });
