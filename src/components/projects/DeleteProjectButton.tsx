import { useState } from "react";
import { useDeleteProject } from "../../api/controllers/projectsController";
import type { Project } from "../../api/types/projectTypes";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { AlertDialog } from "../common/AlertDialog";
import { useNavigate } from "react-router-dom";

type DeleteProjectButtonProps = {
  project: Project;
};

export const DeleteProjectButton = ({ project }: DeleteProjectButtonProps) => {
  const { mutateAsync: mutateAsyncDelete } = useDeleteProject(project.id);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpen = () => setIsDialogOpen(true);
  const handleClose = () => setIsDialogOpen(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    mutateAsyncDelete().then(() => navigate(`/projects`));
    handleClose();
  };

  return (
    <>
      <Button
        size="small"
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={handleOpen}
      >
        Delete
      </Button>
      <AlertDialog
        open={isDialogOpen}
        tilte={"Attention"}
        message={`Are you sure that you want to delete project: ${project.name}`}
        onClose={handleClose}
        onConfirm={handleSubmit}
      />
    </>
  );
};
