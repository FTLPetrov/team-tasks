import { Typography, Box, Container, Button } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetUserById, useUpdateUser } from "../api/userController";
import { ViewUserProfile } from "../components/user/ViewUserProfile";
import { EditUserProfile } from "../components/user/EditUserProfile";
import { ChangePasswordButton } from "../components/user/ChangePasswordButton";

export const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id, 10) : 0;
  const { data: user, isLoading } = useGetUserById(userId);
  const updateUserMutation = useUpdateUser(userId);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
  }) => {
    if (!user) return;

    await updateUserMutation.mutateAsync(data);
    setIsEditing(false);
  };

  const handlePasswordChange = async (_currentPassword: string, newPassword: string) => {
    if (!user) return;

    await updateUserMutation.mutateAsync({
      secret: newPassword,
    });
  };

  if (isLoading || !user) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5">User Profile</Typography>
          {!isEditing && (
            <Button variant="contained" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </Box>

        {isEditing ? (
          <EditUserProfile
            user={user}
            onSubmit={handleSave}
            onCancel={handleCancel}
            isSubmitting={updateUserMutation.isPending}
          />
        ) : (
          <>
            <ViewUserProfile user={user} />
            <ChangePasswordButton
              user={user}
              onPasswordChange={handlePasswordChange}
            />
          </>
        )}
      </Box>
    </Container>
  );
};

