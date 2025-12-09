import { axiosClient } from "../../config/axios.config";
import { queryClient } from "../../config/queryClient.config";
import type { Team } from "../types/teamTypes";
import { useQuery, useMutation } from "@tanstack/react-query";

export const teamKeys = {
  allTeams: ["allTeams"],
  teamDetails: (teamId: string) => [teamKeys.allTeams, `teamDetails-${teamId}`],
};

export const useGetAllTeams = () => {
  return useQuery<Team[]>({
    queryKey: teamKeys.allTeams,
    queryFn: async () => {
      const { data } = await axiosClient.get<Team[]>("/teams");
      return data;
    },
  });
};

export const useGetTeamById = (teamId: string) => {
  return useQuery<Team>({
    queryKey: teamKeys.teamDetails(teamId),
    queryFn: async () => {
      const { data } = await axiosClient.get<Team>(`/teams/${teamId}`);
      return data;
    },
    enabled: !!teamId,
  });
};

export const useCreateTeam = () => {
  return useMutation({
    mutationFn: async (team: Partial<Team>) => {
      const response = await axiosClient.post("/teams", team);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
    },
  });
};

export const useUpdateTeam = (teamId: string) => {
  return useMutation({
    mutationFn: async (team: Partial<Team>) => {
      const response = await axiosClient.put(`/teams/${teamId}`, team);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
    },
  });
};

export const useDeleteTeam = (teamId: string) => {
  return useMutation({
    mutationFn: async () => {
      const response = await axiosClient.delete(`/teams/${teamId}`);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
    },
  });
};
