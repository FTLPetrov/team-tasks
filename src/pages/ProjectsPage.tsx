import { Box, Button, Typography } from "@mui/material";
import { AddProjectButton } from "../components/projects/AddProjectButton";
import { ProjectsLayoutDefault } from "../components/layout/ProjectsLayoutDefault";
import { useState } from "react";
import { ProjectLayoutVertical } from "../components/layout/ProjectsLayoutVertical";
import { useNavigate } from "react-router-dom";

export const ProjectsPage = () => {
  const [view, setView] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  const handleViewMode = () => setView((prev) => !prev);

  const handleViewDetails = (projectId: string) => {
    if (view) {
      setSelectedProjectId(projectId);
    } else {
      navigate(`/projects/${projectId}`);
    }
  };

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

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={handleViewMode} variant="contained">
            View mode
          </Button>
          <AddProjectButton />
        </Box>
      </Box>

      {view ? (
        <ProjectLayoutVertical
          onViewDetails={handleViewDetails}
          selectedProjectId={selectedProjectId}
        />
      ) : (
        <ProjectsLayoutDefault onViewDetails={handleViewDetails} />
      )}
    </Box>
  );
};
