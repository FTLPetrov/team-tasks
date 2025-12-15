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
import { useForm } from "react-hook-form";
import { useAuth } from "../utils/hooks/useAuth";
import { useRedirectIfLogged } from "../utils/hooks/useRedirectIfLogged";
import { useGetAllUsers } from "../api/controllers/userController";

type LoginFormValues = {
  email: string;
  secret: string;
};

export const LoginPage = () => {
  const { login } = useAuth();
  useRedirectIfLogged();

  const { data: users, isLoading } = useGetAllUsers();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormValues>({
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (!users) return;

    const email = data.email.trim().toLowerCase();
    const password = data.secret;

    const found = users.find(
      (u) => u.email.toLowerCase() === email && u.secret === password
    );

    if (!found) {
      setError("email", {
        type: "manual",
        message: "Invalid email or password",
      });
      setError("secret", {
        type: "manual",
        message: "Invalid email or password",
      });
      return;
    }

    login(found);
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
            Login
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Email"
                  fullWidth
                  {...register("email", {
                    required: "Email is required",
                    validate: (v) => v.trim().length > 0 || "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
                    validate: (v) =>
                      v.trim().length > 0 || "Password is required",
                  })}
                  error={!!errors.secret}
                  helperText={errors.secret?.message}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={!isValid || isSubmitting || isLoading}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Don&apos;t have an account? <Link to="/register">Register</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
