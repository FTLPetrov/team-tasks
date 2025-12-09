import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import {
  useDeleteProject,
  useGetProjectById,
} from "../api/controllers/projectsController";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectDetailsView } from "../components/ProjectDetailsView";
import { useState } from "react";
import { ProjectDetailsEdit } from "../components/ProjectDetailsEdit";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

export const ProjectsDetailsPage = () => {
  const { id } = useParams<string>();
  const { data, isLoading, isError, error } = useGetProjectById(id!);
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: mutateAsyncDelete } = useDeleteProject(id!);
  const naviate = useNavigate();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error loading project: {error?.message || "Unknown error"}
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Project not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
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
            <Button
              onClick={() => mutateAsyncDelete().then(()=>naviate('/projects'))}
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
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
        {isEditing ? (
          <ProjectDetailsEdit onSaved={() => setIsEditing(false)} />
        ) : (
          <ProjectDetailsView />
        )}
      </Paper>
    </Box>
  );
};
