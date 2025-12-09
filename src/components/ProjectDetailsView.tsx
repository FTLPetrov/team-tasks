import { Box, Chip, Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetProjectById } from "../api/controllers/projectsController";
import { useGetAllUsers } from "../api/controllers/userController";
import { useGetAllTeams } from "../api/controllers/teamController";

export const ProjectDetailsView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project } = useGetProjectById(id!);
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
    </>
  );
};
