import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useUpdateUser } from "../../api/controllers/userController";
import { useAuth } from "../../utils/hooks/useAuth";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type PasswordChangeValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const ChangePasswordDialog = () => {
  const { login, user } = useAuth();
  const { mutateAsync: mutateAsyncUpdate } = useUpdateUser(user?.id ?? "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpen = () => setIsDialogOpen(true);
  const handleClose = () => setIsDialogOpen(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PasswordChangeValues>({
    mode: "onChange",
  });

  const newPassword = watch("newPassword");

  useEffect(() => {
    if (!isDialogOpen) reset();
  }, [open, reset]);

  const onSubmit = async (data: PasswordChangeValues) => {
    if (!user) return;

    mutateAsyncUpdate({
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      email: user.email,
      secret: data.newPassword,
      createdAt: user.createdAt,
      updatedAt: new Date().toLocaleDateString(),
    }).then(login);

    reset();
    handleClose();
  };

  return (
    <>
      <Box display={"flex"} justifyContent={"center"} sx={{ py: 2 }}>
        <Button
          onClick={() => handleOpen()}
          fullWidth
          variant="contained"
          size="large"
        >
          Change Password
        </Button>
      </Box>
      <Dialog open={isDialogOpen} fullWidth>
        <DialogTitle>Change password</DialogTitle>

        <DialogContent>
          <Stack
            component="form"
            id="change-password-form"
            onSubmit={handleSubmit(onSubmit)}
            spacing={2}
            sx={{ mt: 1 }}
            noValidate
          >
            <TextField
              label="Current password"
              type="password"
              fullWidth
              {...register("currentPassword", {
                required: "Current password is required",
                validate: (v) =>
                  v === user?.secret || "Current Password is incorrect",
              })}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
            />

            <TextField
              label="New password"
              type="password"
              fullWidth
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 8, message: "Minimum 8 characters" },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{12,}$/,
                  message:
                    "Must include uppercase, lowercase, number, and special character (no spaces).",
                },
                validate: (v) =>
                  v !== watch("currentPassword") ||
                  "New password must be different",
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />

            <TextField
              label="Confirm new password"
              type="password"
              fullWidth
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (v) => v === newPassword || "Passwords do not match",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            type="submit"
            form="change-password-form"
            variant="contained"
            disabled={!isValid || isSubmitting}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
