import { Box, Card, Grid, Paper, Typography } from "@mui/material";
import { useGetAllProjects } from "../../api/controllers/projectsController";
import { useAuth } from "../../utils/hooks/useAuth";
import { ProjectCard } from "../projects/ProjectCard";

export const ProjectLayoutVertical = ({
  onViewDetails,
  selectedProjectId,
}: {
  onViewDetails: (id: string) => void;
  selectedProjectId: string | null;
}) => {
  const { data = [] } = useGetAllProjects();
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

  const selectedProject =
    visibleProjects.find((p) => p.id === selectedProjectId) ?? null;

  return (
    <Grid container spacing={12} sx={{ flexDirection: "row" }}>
      <Grid size={{ xs: 1, md: 2 }}>
        <Box display="flex" flexDirection="column" gap={1}>
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              name={project.name}
              onViewDetails={onViewDetails}
            />
          ))}
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 10 }}>
        {selectedProjectId ? (
         <Card
      sx={{
        minWidth: 275,
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: 1
      }}
    >
      {selectedProject?.name}
    </Card>
        ) : (
          "Select a project"
        )}
      </Grid>
    </Grid>
  );
};
