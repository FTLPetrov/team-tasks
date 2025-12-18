import { Box, Button, Chip, Grid, Paper, Typography } from "@mui/material";
import { Close as CloseIcon, Edit as EditIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useGetProjectById } from "../../api/controllers/projectsController";
import { useGetAllUsers } from "../../api/controllers/userController";
import { useGetAllTeams } from "../../api/controllers/teamController";
import { DeleteProjectButton } from "./DeleteProjectButton";
import type { Project } from "../../api/types/projectTypes";
import { useState } from "react";

export const ProjectDetailsView = () => {
  const { id } = useParams();
  const { data: project } = useGetProjectById(id!);
  const [isEditing, setIsEditing] = useState(false);
  const { data: users = [] } = useGetAllUsers();
  const { data: teams = [] } = useGetAllTeams();

  const currentAdmins = project?.adminIds.map(
    (adminToFind) => users.find((user) => user.id === adminToFind)?.displayName
  );

  const currentTeams = project?.teamIds.map(
    (teamToFind) => teams.find((team) => team.id === teamToFind)?.name
  );

  const currentMembers = project?.memberIds.map(
    (memberToFind) =>
      users.find((user) => user.id === memberToFind)?.displayName
  );

  return (
    <>
      <Paper sx={{ p: 2, mb: 3 }} elevation={3}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Project Details
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <DeleteProjectButton project={project as Project} />
            {isEditing ? (
              <Button
                color="error"
                variant="contained"
                startIcon={<CloseIcon />}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            ) : (
              <Button
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
                variant="contained"
              >
                Edit
              </Button>
            )}
          </Box>
        </Box>
        <Box>
          <Grid
            container
            spacing={3}
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Grid size={4} display={"flex"} flexDirection={"column"}>
              <Typography variant="h6" color="text.secondary" display="block">
                {project?.name}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                gutterBottom
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                {project?.description}
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography variant="h6" color="text.secondary" display="block">
                Admins: {currentAdmins?.join(", ") || "None"}
              </Typography>
              <Typography variant="h6" color="text.secondary" display="block">
                Teams: {currentTeams?.join(", ") || "None"}
              </Typography>
              <Typography variant="h6" color="text.secondary" display="block">
                Members: {currentMembers?.join(", ") || "None"}
              </Typography>
            </Grid>
            <Grid size={4}>
              <Box display={"flex"} gap={2}>
                <Typography variant="h6" color="text.secondary" display="block">
                  Status:
                </Typography>
                <Chip label={project?.status}></Chip>
              </Box>
              <Typography variant="h6" color="text.secondary" display="block">
                Created:{" "}
                {project && new Date(project.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="h6" color="text.secondary" display="block">
                Updated:{" "}
                {project && new Date(project.updatedAt).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export default ProjectDetailsView;
