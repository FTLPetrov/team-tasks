import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { Task } from "../../api/types/taskTypes";

type Props = {
  open: boolean;
  task?: Task | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const DeleteTaskDialog = ({
  open,
  task,
  loading,
  onClose,
  onConfirm,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Delete task</DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to delete{" "}
          <strong>{task?.title ?? "this task"}</strong>?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
