import { useState } from "react";
import { Box, Container, Paper } from "@mui/material";
import { ProfileEdit } from "../components/profile/ProfileEdit";
import { ProfileView } from "../components/profile/ProfileView";
import { ChangePasswordDialog } from "../components/profile/ChangePasswordDialog";

export const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="sm">
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box>
            {isEditing ? (
              <ProfileEdit
                onCancel={() => setIsEditing(false)}
                onSaved={() => setIsEditing(false)}
              />
            ) : (
              <ProfileView onEdit={() => setIsEditing(true)} />
            )}
          </Box>
        </Paper>
            <ChangePasswordDialog />
      </Container>
    </Box>
  );
};
