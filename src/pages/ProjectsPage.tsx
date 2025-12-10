import { Box, CircularProgress, Typography } from "@mui/material";
import { useGetAllProjects } from "../api/controllers/projectsController";
import { useAuth } from "../utils/hooks/useAuth";
import { ProjectCard } from "../components/projects/ProjectCard";
import { AddProjectButton } from "../components/projects/AddProjectButton";

export const ProjectsPage = () => {
  const { data = [], isLoading, isError, error } = useGetAllProjects();
  const { user } = useAuth();
  const currentUser = user?.id;

  const visibleProjects = data.filter((project) => {
    if (!currentUser) return false;
    if (
      project.adminIds.includes(currentUser) ||
      project.memberIds.includes(currentUser)
    ) {
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
          Projects
        </Typography>
        <AddProjectButton />
      </Box>

      {isLoading && (
        <Box className="teams-loading">
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Typography color="error">Error: {(error as Error).message}</Typography>
      )}

      {!isLoading && !isError && visibleProjects.length === 0 && (
        <Typography>No projects available for your account.</Typography>
      )}

      {!isLoading && !isError && visibleProjects.length > 0 && (
        <Box className="teams-container">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </Box>
      )}
    </Box>
  );
};
