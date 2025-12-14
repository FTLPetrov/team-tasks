import { useState } from "react";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { ProfileEdit } from "../components/profile/ProfileEdit";
import { ProfileView } from "../components/profile/ProfileView";

export const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveClick = () => {
    const form = document.getElementById(
      "profile-edit-form"
    ) as HTMLFormElement | null;
    form?.requestSubmit();
  };

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="sm">
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Profile
            </Typography>

            {!isEditing ? (
              <Button
                size="small"
                variant="contained"
                sx={{ mb: 2 }}
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            ) : (
              <Box display="flex" gap={1}>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  sx={{ mb: 2 }}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ mb: 2 }}
                  startIcon={<SaveIcon />}
                  onClick={handleSaveClick}
                >
                  Save
                </Button>
              </Box>
            )}
          </Box>

          {isEditing ? (
            <ProfileEdit onSaved={() => setIsEditing(false)} />
          ) : (
            <ProfileView />
          )}
        </Paper>
      </Container>
    </Box>
  );
};
