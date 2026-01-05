import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import type { User } from "../../api/types/userTypes";
import { validatePassword } from "../../utils/validation";

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ChangePasswordButtonProps = {
  user: User;
  onPasswordChange: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
};

export const ChangePasswordButton = ({
  user,
  onPasswordChange,
}: ChangePasswordButtonProps) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    mode: "onChange",
  });

  const newPassword = watch("newPassword");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const handleFormSubmit = async (data: ChangePasswordFormValues) => {
    if (data.currentPassword !== user.secret) {
      setError("currentPassword", {
        type: "manual",
        message: "Current password is incorrect",
      });
      return;
    }

    if (data.newPassword === data.currentPassword) {
      setError("newPassword", {
        type: "manual",
        message: "New password must be different from current password",
      });
      return;
    }

    await onPasswordChange(data.currentPassword, data.newPassword);
    reset();
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" fullWidth onClick={handleOpen} sx={{ mt: 2 }}>
        Change Password
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  {...register("currentPassword", {
                    required: "Current password is required",
                  })}
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword?.message}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  {...register("newPassword", {
                    required: "New password is required",
                    validate: validatePassword,
                  })}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Changing..." : "Change Password"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
