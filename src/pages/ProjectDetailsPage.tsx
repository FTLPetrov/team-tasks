import { useParams } from "react-router-dom";
import { useGetProjectById } from "../api/controllers/projectController";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { useGetAllComments } from "../api/controllers/commentController";
import dayjs from "dayjs";

export const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { data: project } = useGetProjectById(Number(id));
  const { data: comments } = useGetAllComments();

  const filteredComments = comments?.filter((c) =>
    project?.posts.includes(c.postId)
  );

  return (
    <>
      <Box>
        <Paper sx={{ mt: 2, p: 2 }}>
          <Typography variant="h6">Project Details</Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }}>Name: {project?.name}</Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              Description: {project?.description}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              Created at:{" "}
              {project?.createdAt
                ? dayjs(project.createdAt).format("MMM D, YYYY")
                : "-"}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              Created at:{" "}
              {project?.updatedAt
                ? dayjs(project.updatedAt).format("MMM D, YYYY")
                : "-"}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              Working teams: {project?.teamIds}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>Admins: {project?.adminIds}</Grid>
            <Grid size={{ xs: 12, sm: 3 }}>Members: {project?.memberIds}</Grid>
            <Grid size={{ xs: 12, sm: 3 }}>Status: {project?.status}</Grid>
            <Grid size={{ xs: 12, sm: 3 }}>Posts: {project?.posts}</Grid>
          </Grid>
        </Paper>

        <Paper sx={{ mt: 2, p: 2 }}>
          <Typography variant="h6">Comments</Typography>

          {filteredComments?.length ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {filteredComments.map(({ id, name, email, body }) => (
                <Grid key={id} size={{ xs: 12, sm: 6 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                    }}
                  >
                    <Typography variant="subtitle1" noWrap>
                      {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {email}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {body}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" sx={{ mt: 1 }}>
              No comments for this project.
            </Typography>
          )}
        </Paper>
      </Box>
    </>
  );
};
