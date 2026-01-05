import { axiosClient } from "../../config/axios.config";
import { queryClient } from "../../config/queryClient.config";
import type { Team } from "../types/teamTypes";
import { useQuery, useMutation } from "@tanstack/react-query";

export const teamKeys = {
  allTeams: ["allTeams"],
  teamDetails: (teamId: number) => [teamKeys.allTeams, `teamDetails-${teamId}`],
};

export const useGetAllTeams = () => {
  return useQuery<Team[]>({
    queryKey: teamKeys.allTeams,
    queryFn: async () => {
      const { data } = await axiosClient.get<Team[]>(`/teams`);
      return data;
    },
  });
};

export const useGetTeamById = (teamId: number) => {
  return useQuery<Team>({
    queryKey: teamKeys.teamDetails(teamId),
    queryFn: async () => {
      const { data } = await axiosClient.get<Team>(`/teams/${teamId}`);
      return data;
    },
    });
};

export const useCreateTeam = () => {
  return useMutation({
    mutationFn: async (team: Partial<Team>) => {
      const response = await axiosClient.post<Team>("/teams", team);
      return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
    },
  });
};

export const useUpdateTeam = (teamId: number) => {
  return useMutation({
    mutationFn: async (team: Partial<Team>) => {
        const currentTeam = await axiosClient.get<Team>(`/teams/${teamId}`);
        const response = await axiosClient.put<Team>(`/teams/${teamId}`, {
            ...currentTeam.data,
            ...team,
            createdAt: currentTeam.data.createdAt,
            updatedAt: new Date().toISOString(),
        });
        return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: teamKeys.teamDetails(teamId) });
        queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
    },
    });
};

export const useDeleteTeam = (teamId: number) => {
  return useMutation({
    mutationFn: async () => {
         await axiosClient.delete<void>(`/teams/${teamId}`);
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
    },
  });
};