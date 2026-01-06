import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { Project } from "../../api/types/projectTypes";

type Props = {
  open: boolean;
  project?: Project | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const DeleteProjectDialog = ({
  open,
  project,
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
      <DialogTitle>Delete Project</DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to delete{" "}
          <strong>{project?.name ?? "this project"}</strong>
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
