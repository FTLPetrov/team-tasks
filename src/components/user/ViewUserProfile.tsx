import { Typography, Paper, Grid } from "@mui/material";
import type { User } from "../../api/types/userTypes";

type ViewUserProfileProps = {
  user: User;
};

export const ViewUserProfile = ({ user }: ViewUserProfileProps) => {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" color="text.secondary">
            First Name
          </Typography>
          <Typography variant="body1">{user.firstName}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" color="text.secondary">
            Last Name
          </Typography>
          <Typography variant="body1">{user.lastName}</Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" color="text.secondary">
            Email
          </Typography>
          <Typography variant="body1">{user.email}</Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" color="text.secondary">
            Display Name
          </Typography>
          <Typography variant="body1">{user.displayName}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" color="text.secondary">
            Created At
          </Typography>
          <Typography variant="body1">
            {user.createdAt && !isNaN(new Date(user.createdAt).getTime())
              ? new Date(user.createdAt).toLocaleString()
              : "N/A"}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" color="text.secondary">
            Updated At
          </Typography>
          <Typography variant="body1">
            {user.updatedAt && !isNaN(new Date(user.updatedAt).getTime())
              ? new Date(user.updatedAt).toLocaleString()
              : "N/A"}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
