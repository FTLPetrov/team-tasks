import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/hooks/useAuth";
import { useCreateUser } from "../api/controllers/userController";
import type { CreateUserInput } from "../api/types/userTypes";

export const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [firstNameTouched, setFirstNameTouched] = useState(false);

  const [lastName, setLastName] = useState("");
  const [lastNameTouched, setLastNameTouched] = useState(false);

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const [secret, setSecret] = useState("");
  const [secretTouched, setSecretTouched] = useState(false);

  const [confirmSecret, setConfirmSecret] = useState("");
  const [confirmSecretTouched, setConfirmPasswordTouched] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const { login, isAuthenticated } = useAuth();
  const { mutateAsync: createUser } = useCreateUser();
  const navigate = useNavigate();

  // If already authenticated, go home
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // ---------- Validation helpers ----------

  const getFirstNameError = () => {
    const trimmed = firstName.trim();
    if (!trimmed) return "First name is required";

    if (/\d/.test(trimmed)) {
      return "First name cannot contain numbers";
    }

    if (trimmed.charAt(0) !== trimmed.charAt(0).toUpperCase()) {
      return "First name must start with uppercase";
    }
    return "";
  };

  const getLastNameError = () => {
    const trimmed = lastName.trim();
    if (!trimmed) return "Last name is required";

    if (/\d/.test(trimmed)) {
      return "Last name cannot contain numbers";
    }

    if (trimmed.charAt(0) !== trimmed.charAt(0).toUpperCase()) {
      return "Last name must start with uppercase";
    }
    return "";
  };

  const getEmailError = () => {
    const trimmed = email.trim();
    if (!trimmed) return "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return "Not a valid email";
    }
    return "";
  };

  const getPasswordError = () => {
    const trimmed = secret.trim();
    if (!trimmed) return "Password is required";

    if (trimmed.length < 8) {
      return "Password should be at least 8 characters.";
    }
    if (!/\d/.test(trimmed)) {
      return "Password should contain at least one number.";
    }
    return "";
  };

  const getConfirmPasswordError = () => {
    const trimmed = confirmSecret.trim();
    if (!trimmed) return "Confirm password is required";
    if (trimmed !== secret.trim()) {
      return "Passwords don't match";
    }
    return "";
  };

  // Only show errors after the field has been touched
  const firstNameError = firstNameTouched ? getFirstNameError() : "";
  const lastNameError = lastNameTouched ? getLastNameError() : "";
  const emailError = emailTouched ? getEmailError() : "";
  const passwordError = secretTouched ? getPasswordError() : "";
  const confirmPasswordError = confirmSecretTouched
    ? getConfirmPasswordError()
    : "";

  const isFormValid =
    !firstNameError &&
    !lastNameError &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError &&
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    secret.trim() &&
    confirmSecret.trim() &&
    !isSubmitting;

  // ---------- Submit handler ----------

  const handleRegister = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    setRegisterError("");

    try {
      const input: CreateUserInput = {
        displayName: `${firstName.trim()} ${lastName.trim()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        secret: secret.trim(),
      };

      const createdUser = await createUser(input);

      // store in auth context; useEffect above (or LoginPage logic) will redirect
      login(createdUser);
    } catch (err) {
      setRegisterError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          mt: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.light" }} />
        <Typography variant="h5">Register</Typography>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                error={!!firstNameError}
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => setFirstNameTouched(true)}
                helperText={firstNameError || " "}
              />
            </Grid>

            <Grid size={6}>
              <TextField
                error={!!lastNameError}
                name="lastName"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => setLastNameTouched(true)}
                helperText={lastNameError || " "}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                error={!!emailError}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                helperText={emailError || " "}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                error={!!passwordError}
                required
                fullWidth
                name="secret"
                label="Password"
                type="password"
                id="secret"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                onBlur={() => setSecretTouched(true)}
                helperText={passwordError || " "}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                error={!!confirmPasswordError}
                required
                fullWidth
                name="confirmSecret"
                label="Confirm Password"
                type="password"
                id="confirmSecret"
                value={confirmSecret}
                onChange={(e) => setConfirmSecret(e.target.value)}
                onBlur={() => setConfirmPasswordTouched(true)}
                helperText={confirmPasswordError || " "}
              />
            </Grid>
          </Grid>

          {registerError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {registerError}
            </Typography>
          )}

          <Button
            disabled={!isFormValid}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleRegister}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid>
              <Link to="/login">Already have an account? Login</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
