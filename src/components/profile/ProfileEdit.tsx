/* eslint-disable react-hooks/immutability */
import { useEffect } from "react";
import { useAuth } from "../../utils/hooks/useAuth";
import { useForm } from "react-hook-form";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { useUpdateUser } from "../../api/controllers/userController";

type ProfileEditValues = {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  secret: string;
};

export const ProfileEdit = ({
  onCancel,
  onSaved,
}: {
  onCancel: () => void;
  onSaved: () => void;
}) => {
  const { login, user } = useAuth();

  const { mutateAsync: mutateAsyncUpdate } = useUpdateUser(user?.id ?? "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileEditValues>({
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      displayName: user?.displayName ?? "",
      email: user?.email ?? "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!user) return;
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      email: user.email,
    });
  }, [user, reset]);

  const onSubmit = (data: ProfileEditValues) => {
    mutateAsyncUpdate({
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.displayName,
      email: data.email,
      secret: user?.secret,
      createdAt: user?.createdAt,
      updatedAt: new Date().toLocaleDateString(),
    }).then(login);

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
      <Box display={"flex"} justifyContent="space-between">
        <Typography variant="h6">Profile</Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          sx={{ mb: 2 }}
          gap={1}
        >
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<EditIcon />}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => onSubmit}
            type="submit"
          >
            Save
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="First name"
            fullWidth
            {...register("firstName", {
              required: "First name is required",
              validate: (v) => {
                const value = v.trim();
                if (!value) return "First name is required";
                if (value[0] !== value[0].toUpperCase())
                  return "First name must start with an uppercase letter";
                return true;
              },
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
              validate: (v) => {
                const value = v.trim();
                if (!value) return "First name is required";
                if (value[0] !== value[0].toUpperCase())
                  return "First name must start with an uppercase letter";
                return true;
              },
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
              minLength: {
                value: 4,
                message: "Display name must be at least 4 characters",
              },
              pattern: {
                value: /^[A-Za-z0-9]+$/,
                message: "Display name can contain only letters and numbers",
              },
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
      </Grid>
    </Box>
  );
};
