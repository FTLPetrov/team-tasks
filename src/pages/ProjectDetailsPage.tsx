import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useGetProjectById } from "../api/controllers/projectsController";
import { useParams } from "react-router-dom";
import { ProjectDetailsView } from "../components/projects/ProjectDetailsView";
import { useState } from "react";
import { ProjectDetailsEdit } from "../components/projects/ProjectDetailsEdit";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { DeleteProjectButton } from "../components/projects/DeleteProjectButton";
import { TaskTable } from "../components/tasks/TaskTable";
import { TaskDialogFormButton } from "../components/tasks/TaskDialogFormButton";
import {
  FilterTasksButtons,
  type Filters,
} from "../components/tasks/FilterTasksButtons";
import type { TaskStatus } from "../utils/types/TaskStatus";
import type { TaskPriority } from "../utils/types/TaskPriority";

export const ProjectsDetailsPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetProjectById(id!);
  const [isEditing, setIsEditing] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    title: "",
    description: "",
    status: "" as TaskStatus,
    priority: "" as TaskPriority,
    assignedId: "",
  });

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
            <DeleteProjectButton project={data} />
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TaskDialogFormButton />
        <FilterTasksButtons filters={filters} onChange={setFilters} />
      </Box>
      <Box sx={{ mt: 3, mb: 6 }}>
        <TaskTable filters={filters} />
      </Box>
    </Box>
  );
};
