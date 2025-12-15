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
import { Link } from "react-router-dom";
import {
  useCreateUser,
  useGetAllUsers,
} from "../api/controllers/userController";
import { useAuth } from "../utils/hooks/useAuth";
import { useRedirectIfLogged } from "../utils/hooks/useRedirectIfLogged";
import { useForm } from "react-hook-form";

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  secret: string;
  confirmSecret: string;
};

export const RegisterPage = () => {
  const { mutateAsync: mutateAsyncCreate } = useCreateUser();
  const { login } = useAuth();
  const { data: users } = useGetAllUsers();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterFormValues>({
    mode: "onChange",
  });

  const secret = watch("secret");

  const onSubmit = async (data: RegisterFormValues) => {
    const exists = users?.some(
      (u) => u.email.trim().toLowerCase() === data.email.trim().toLowerCase()
    );
    if (exists) {
      setError("email", {
        type: "manual",
        message: "Email is already registered",
      });
      return;
    }

    const newUser = await mutateAsyncCreate({
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      secret: data.secret,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
    });

    login(newUser);
  };

  useRedirectIfLogged();

  return (
    <>
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
            <Box display={"flex"} justifyContent={"center"}>
              <Avatar sx={{ m: 1, bgcolor: "primary.light" }}></Avatar>
            </Box>
            <Typography variant="h5" sx={{ mb: 2 }} align="center">
              Create account
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="First name"
                    fullWidth
                    {...register("firstName", {
                      required: "First name is required",
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: "Only letters are allowed",
                      },
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
                        if (!value) return "Last name is required";
                        if (value[0] !== value[0].toUpperCase())
                          return "Last name must start with an uppercase letter";
                        return true;
                      },
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
                      validate: (v) =>
                        v.trim().length > 0 || "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.(com)$/i,
                        message: "Enter a valid email",
                      },
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    {...register("secret", {
                      required: "Password is required",
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{12,}$/,
                        message:
                          "Password must be 12+ chars and include upper, lower, number, and special character (no spaces).",
                      },
                    })}
                    error={!!errors.secret}
                    helperText={errors.secret?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Confirm password"
                    type="password"
                    fullWidth
                    {...register("confirmSecret", {
                      required: "Confirm password is required",
                      validate: (v) => v === secret || "Passwords do not match",
                    })}
                    error={!!errors.confirmSecret}
                    helperText={errors.confirmSecret?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={!isValid || isSubmitting}
                  >
                    Register
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
    </>
  );
};
