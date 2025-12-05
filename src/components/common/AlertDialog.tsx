import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type AlertProps = {
  open: boolean;
  tilte: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
};

export const AlertDialog = (props: AlertProps) => {
  const { open, message, onClose, onConfirm, tilte } = props;

  return (
    <>
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>{tilte}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="error" variant="contained" onClick={onConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
