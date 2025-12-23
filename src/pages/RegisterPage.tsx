import { useForm } from "react-hook-form";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useCreateUser } from "../api/userController";
import { useGetAllUsers } from "../api/userController";
import { validatePassword, validateName, validateEmail } from "../utils/validation";

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
};

export const RegisterPage = () => {
  const { user, loginAction } = useAuth();
  const navigate = useNavigate();
  const { data: users } = useGetAllUsers();
  const createUserMutation = useCreateUser();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterFormValues>({
    mode: "onChange",
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormValues) => {
    if (users?.some((u) => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
      setError("email", {
        type: "manual",
        message: "Email already exists",
      });
      return;
    }

    const displayName =
      data.displayName.trim() || `${data.firstName.trim()} ${data.lastName.trim()}`;

    const userData = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      displayName: displayName.trim(),
      secret: data.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createUserMutation.mutateAsync(userData);
    
    await loginAction({
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });
    
    navigate("/");
  };

  return (
    <Box
      sx={{
        mt: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" justifyContent="center">
            <Avatar sx={{ m: 1, bgcolor: "primary.light" }} />
          </Box>
          <Typography variant="h5" sx={{ mb: 2 }} align="center">
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={!isValid || isSubmitting || createUserMutation.isPending}
                >
                  {isSubmitting || createUserMutation.isPending
                    ? "Creating account..."
                    : "Register"}
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Already have an account? <Link to="/login">Login</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
