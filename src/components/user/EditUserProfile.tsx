import { TextField, Button, Paper, Grid, Box } from "@mui/material";
import { useState, useEffect } from "react";
import type { User } from "../../api/userTypes";

type EditUserProfileProps = {
  user: User;
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
  }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
};

export const EditUserProfile = ({
  user,
  onSubmit,
  onCancel,
  isSubmitting,
}: EditUserProfileProps) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [displayName, setDisplayName] = useState(user.displayName);

  useEffect(() => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setDisplayName(user.displayName);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ firstName, lastName, email, displayName });
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};
