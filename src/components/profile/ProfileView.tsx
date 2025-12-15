import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../../utils/hooks/useAuth";

export const ProfileView = ({ onEdit }: { onEdit: () => void }) => {
  const user = useAuth().user;
  if (!user) return null;

  return (
    <>
      <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6">
          Profile
        </Typography>
        <Button
          size="small"
          variant="contained"
          startIcon={<EditIcon />}
          onClick={onEdit}
        >
          Edit
        </Button>
      </Box>

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
          <TextField
            label="Last name"
            value={user.lastName}
            fullWidth
            disabled
          />
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
            value={user.createdAt.toLocaleString()}
            fullWidth
            disabled
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Updated at"
            value={user.updatedAt}
            fullWidth
            disabled
          />
        </Grid>
      </Grid>
    </>
  );
};
