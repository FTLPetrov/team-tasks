import { Grid, TextField } from "@mui/material";
import { useAuth } from "../../utils/hooks/useAuth";

export const ProfileView = () => {
  const user = useAuth().user;

  if (!user) return null;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="First name"
          value={user.firstName}
          fullWidth
          disabled
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField label="Last name" value={user.lastName} fullWidth disabled />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          label="Display name"
          value={user.displayName}
          fullWidth
          disabled
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField label="Email" value={user.email} fullWidth disabled />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Created at"
          value={new Date(user.createdAt).toLocaleString()}
          fullWidth
          disabled
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Updated at"
          value={new Date(user.updatedAt).toLocaleString()}
          fullWidth
          disabled
        />
      </Grid>
    </Grid>
  );
};
