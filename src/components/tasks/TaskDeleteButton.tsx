import { Button } from "@mui/material";
import { useDeleteTask } from "../../api/controllers/tasksController";
import type { Task } from "../../api/types/taskTypes";
import DeleteIcon from "@mui/icons-material/Delete";
import { AlertDialog } from "../common/AlertDialog";
import { useState } from "react";

type DeleteTaskButtonProps = {
  task: Task;
};

export const TaskDeleteButton = ({ task }: DeleteTaskButtonProps) => {
  const { mutateAsync: mutateAsyncDelete } = useDeleteTask(task.id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpen = () => setIsDialogOpen(true);
  const handleClose = () => setIsDialogOpen(false);

  const handleSubmit = () => {
    mutateAsyncDelete();
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
        message={`Are you sure that you want to delete task: ${task.title}`}
        onClose={handleClose}
        onConfirm={handleSubmit}
      />
    </>
  );
};
