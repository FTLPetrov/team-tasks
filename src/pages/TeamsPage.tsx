import { Box, Typography, CircularProgress } from "@mui/material";
import { useGetAllTeams } from "../api/controllers/teamController";
import { TeamCard } from "../components/TeamCard";
import { TeamDialogFormButton } from "../components/common/TeamDialogFormButton";
import { useAuth } from "../utils/hooks/useAuth";

export const TeamsPage = () => {
  const { data = [], isLoading, isError, error } = useGetAllTeams();
  const { user } = useAuth();
  const currentUser = user?.id;

  const visibleTeams = data.filter((team) => {
    if (!currentUser) return false;
    if (team.owner === currentUser) {
      return true;
    }
    if (team.users.includes(currentUser)) {
      return true;
    }
    return false;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h2">
          Teams
        </Typography>
        <TeamDialogFormButton />
      </Box>

      {isLoading && (
        <Box className="teams-loading">
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Typography color="error">Error: {(error as Error).message}</Typography>
      )}

      {!isLoading && !isError && visibleTeams.length === 0 && (
        <Typography>No teams available for your account.</Typography>
      )}

      {!isLoading && !isError && visibleTeams.length > 0 && (
        <Box className="teams-container">
          {visibleTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </Box>
      )}
    </Box>
  );
};
