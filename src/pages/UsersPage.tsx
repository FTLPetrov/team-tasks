import { Box, Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useGetAllUsers } from "../api/controllers/userController";
import { useGetAllTeams } from "../api/controllers/teamController";
import { UserCard } from "../components/user/UserCard";
import { CreateUserDialog } from "../components/user/CreateUserDialog";
import { useGetAllProjects } from "../api/controllers/projectController";

export const UsersPage = () => {
  const { data: users, isLoading, isError } = useGetAllUsers();
  const { data: teams } = useGetAllTeams();
  const { data: projects } = useGetAllProjects();
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const shouldScrollUsers = (users?.length ?? 0) > 10;
  return (
    <Box>
      <Box sx={{ mt: 2, p: 2, border: 1, borderRadius: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Users
          </Typography>

          <Button variant="contained" onClick={() => setCreateOpen(true)}>
            Create
          </Button>
        </Box>

        {isLoading && <Typography>Loading users...</Typography>}

        {isError && (
          <Typography color="error">Failed to load users.</Typography>
        )}

        {users?.length ? (
          <Box
            sx={
              (shouldScrollUsers && {
                mt: 1,
                maxHeight: 520,
                overflowY: "auto",
                pr: 1,
              }) || { mt: 1 }
            }
          >
            <Grid container spacing={2}>
              {users.map((user) => (
                <Grid key={user.id} size={{ xs: 12 }}>
                  <UserCard
                    user={user}
                    teams={teams ?? []}
                    projects={projects ?? []}
                    isEditing={editingUserId === user.id}
                    onStartEdit={() => setEditingUserId(user.id)}
                    onCancelEdit={() => setEditingUserId(null)}
                    isSubmitting={false}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Typography>No users found.</Typography>
        )}

        <CreateUserDialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
        />
      </Box>
    </Box>
  );
};
