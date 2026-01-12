import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { User } from "../../api/types/userTypes";

type Props = {
  open: boolean;
  user?: User | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const DeleteUserDialog = ({
  open,
  user,
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
      <DialogTitle>Delete user</DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to delete{" "}
          <strong>{user?.displayName ?? "this user"}</strong>?
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
