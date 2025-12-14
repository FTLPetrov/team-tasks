import { useEffect } from "react";
import { useAuth } from "../../utils/hooks/useAuth";
import { useForm } from "react-hook-form";
import { Box, Grid, TextField } from "@mui/material";
import { useUpdateUser } from "../../api/controllers/userController";

type ProfileEditValues = {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  secret: string;
  confirmSecret: string;
};

export const ProfileEdit = ({ onSaved }: { onSaved: () => void }) => {
  const user = useAuth().user;

  const { mutateAsync: mutateAsyncUpdate } = useUpdateUser(user?.id ?? "");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileEditValues>({
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      displayName: user?.displayName ?? "",
      email: user?.email ?? "",
      secret: "",
      confirmSecret: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (!user) return;
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      email: user.email,
      secret: "",
      confirmSecret: "",
    });
  }, [user, reset]);

  const secret = watch("secret");

  const onSubmit = (data: ProfileEditValues) => {
    mutateAsyncUpdate({
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.displayName,
      email: data.email,
      secret: data.secret || undefined,
    });

    onSaved();
  };

  if (!user) return null;

  return (
    <Box
      id="profile-edit-form"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="First name"
            fullWidth
            {...register("firstName", {
              required: "First name is required",
            })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Last name"
            fullWidth
            {...register("lastName", {
              required: "Last name is required",
            })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Display name"
            fullWidth
            {...register("displayName", {
              required: "Display name is required",
            })}
            error={!!errors.displayName}
            helperText={errors.displayName?.message}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Email"
            fullWidth
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="New password"
            type="password"
            fullWidth
            {...register("secret", {
              validate: (v) =>
                !v || v.length >= 6 || "Password must be at least 6 characters",
            })}
            error={!!errors.secret}
            helperText={
              errors.secret?.message || "Leave blank to keep current password"
            }
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Confirm password"
            type="password"
            fullWidth
            {...register("confirmSecret", {
              validate: (v) => {
                if (!secret && !v) return true;
                return v === secret || "Passwords do not match";
              },
            })}
            error={!!errors.confirmSecret}
            helperText={errors.confirmSecret?.message}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
