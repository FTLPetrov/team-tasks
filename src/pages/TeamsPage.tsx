import { Box, Typography, CircularProgress } from "@mui/material";
import { TeamCard } from "../components/TeamCard";
import { useGetAllTeams } from "../api/controllers/teamController";

export const TeamsPage = () => {
  const { data = [], isLoading, isError, error } = useGetAllTeams();

  if (isLoading) {
    return (
      <Box className="teams-loading">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Box>Error: {(error as Error).message}</Box>;
  }

  if (data.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No existing teams.</Typography>
      </Box>
    );
  }

  return (
    <Box className="teams-container">
      {data.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </Box>
  );
};
