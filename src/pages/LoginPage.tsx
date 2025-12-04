import {
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/hooks/useAuth";
import { useGetAllUsers } from "../api/controllers/userController";
import type { User } from "../api/types/userTypes";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = useGetAllUsers();
  const { data } = fetchUsers;

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const getEmailError = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return "Not a valid email address.";
    }
    return "";
  };

  const getPasswordError = () => {
    const trimmedSecret = secret.trim();
    if (!trimmedSecret) return "";

    if (trimmedSecret.length < 8) {
      return "Password should be at least 8 characters.";
    }
    if (!/\d/.test(trimmedSecret)) {
      return "Password should contain at least one number.";
    }
    return "";
  };

  const emailError = getEmailError();
  const passwordError = getPasswordError();
  const isFormValid =
    !!email && !!secret && !emailError && !passwordError && !isSubmitting;

  const handleLogin = async () => {
    if (!isFormValid || isSubmitting) return;

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSecret = secret.trim();

    setLoginError("");
    setIsSubmitting(true);

    try {
      if (!data || !Array.isArray(data)) {
        setLoginError("User data is still loading. Please try again.");
        return;
      }

      const existingUser = data.find(
        ({ email: userEmail }) =>
          userEmail?.toLowerCase().trim() === trimmedEmail
      ) as User | undefined;

      if (!existingUser) {
        setLoginError("User doesn't exist.");
        return;
      }

      if (existingUser.secret !== trimmedSecret) {
        setLoginError("Incorrect password.");
        return;
      }

      login(existingUser);
    } finally {
      setIsSubmitting(false);
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
      <Avatar sx={{ m: 1, bgcolor: "primary.light" }} />
      <Typography variant="h5">Login</Typography>

      <Box sx={{ mt: 1 }}>
        <TextField
          error={!!emailError}
          type="email"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          helperText={emailError || " "}
        />

        <TextField
          error={!!passwordError}
          type="password"
          margin="normal"
          required
          fullWidth
          id="secret"
          label="Password"
          name="secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          helperText={passwordError || " "}
        />

        <Button
          disabled={!isFormValid}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleLogin}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>

        {loginError && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {loginError}
          </Typography>
        )}

        <Grid container justifyContent="flex-end">
          <Grid>
            <Link to="/register">Don't have an account? Register</Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
