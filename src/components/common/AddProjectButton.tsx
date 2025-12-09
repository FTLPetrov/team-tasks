/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useCreateProject } from "../../api/controllers/projectsController";
import { useAuth } from "../../utils/hooks/useAuth";
import Button from "@mui/material/Button";
import { ProjectStatus } from "../../utils/types/ProjectStatus";
import AddIcon from "@mui/icons-material/Add";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";

export const AddProjectButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const { mutateAsync: mutateAsyncCreate } = useCreateProject();
  const { user } = useAuth();

  const handleOpen = () => setIsDialogOpen(true);

  const handleClose = () => {
    setIsDialogOpen(false);
    setProjectName("");
    setProjectDescription("");
  };

  useEffect(() => {
    if (!isDialogOpen) return;

    setProjectName("");
    setProjectDescription("");
  }, [isDialogOpen]);

  const handleSubmit = () => {
    if (!projectName.trim()) return;

    mutateAsyncCreate({
      name: projectName.trim(),
      description: projectDescription.trim(),
      adminIds: [user?.id || ""],
      memberIds: [user?.id || ""],
      teamIds: [],
      status: ProjectStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    handleClose();
  };

  return (
    <>
      <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
        Add Project
      </Button>
      <Dialog open={isDialogOpen} onClose={handleClose}>
        <DialogTitle>Create your project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="projectName"
            label="Name your project"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            id="description"
            name="Description"
            label="Project Description"
            type="text"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
          >Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
