import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  useCreateUser,
  useGetAllUsers,
} from "../../api/controllers/userController";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../../utils/validation";

type CreateUserFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
  isAdmin: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export const CreateUserDialog = ({ open, onClose }: Props) => {
  const { data: users } = useGetAllUsers();
  const createUserMutation = useCreateUser();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateUserFormValues>({
    mode: "onChange",
    defaultValues: {
      isAdmin: false,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        displayName: "",
        password: "",
        confirmPassword: "",
        isAdmin: false,
      });
    }
  }, [open, reset]);

  const { ref: isAdminRef, ...isAdminField } = register("isAdmin");

  const password = useWatch({ control, name: "password" }) ?? "";

  const submit = async (data: CreateUserFormValues) => {
    if (
      users?.some(
        (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
      )
    ) {
      setError("email", {
        type: "manual",
        message: "Email already exists",
      });
      return;
    }

    const displayName =
      data.displayName.trim() ||
      `${data.firstName.trim()} ${data.lastName.trim()}`;

    await createUserMutation.mutateAsync({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      displayName: displayName.trim(),
      secret: data.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAdmin: data.isAdmin,
    });

    onClose();
  };

  const handleClose = () => {
    if (isSubmitting || createUserMutation.isPending) return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create user</DialogTitle>

      <DialogContent>
        <form id="create-user-form" onSubmit={handleSubmit(submit)} noValidate>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="First Name"
                fullWidth
                autoFocus
                {...register("firstName", {
                  required: "First name is required",
                  validate: validateName,
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Last Name"
                fullWidth
                {...register("lastName", {
                  required: "Last name is required",
                  validate: validateName,
                })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Email"
                fullWidth
                {...register("email", {
                  required: "Email is required",
                  validate: validateEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Display Name (optional)"
                fullWidth
                {...register("displayName")}
                error={!!errors.displayName}
                helperText={errors.displayName?.message}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                {...register("password", {
                  required: "Password is required",
                  validate: validatePassword,
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                label="Register as admin"
                control={<Checkbox inputRef={isAdminRef} {...isAdminField} />}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          disabled={isSubmitting || createUserMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="create-user-form"
          variant="contained"
          disabled={!isValid || isSubmitting || createUserMutation.isPending}
        >
          {isSubmitting || createUserMutation.isPending
            ? "Creating account..."
            : "Register"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
