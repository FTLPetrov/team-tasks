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
import type { LoginCredentials } from "../utils/types/authTypes";
import { useAuth } from "../auth/AuthProvider";
import { validateEmail } from "../utils/validation";

export const LoginPage = () => {
  const { loginAction, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginCredentials>({
    mode: "onChange",
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await loginAction(data);
      navigate("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during login";
      
      setError("email", {
        type: "manual",
        message: errorMessage,
      });
      setError("password", {
        type: "manual",
        message: errorMessage,
      });
    }
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
                  autoFocus
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
                  label="Password"
                  type="password"
                  fullWidth
                  {...register("password", {
                    required: "Password is required",
                    validate: (v) =>
                      v.trim().length > 0 || "Password is required",
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Login"}
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Don't have an account? <Link to="/register">Register</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
