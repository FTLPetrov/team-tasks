import { Button, Grid, Paper, Typography } from "@mui/material";
import type { User } from "../../api/types/userTypes";
import type { Team } from "../../api/types/teamTypes";
import type { Project } from "../../api/types/projectTypes";
import { useDeleteUser } from "../../api/controllers/userController";
import { usePatchTeamUsers } from "../../api/controllers/teamController";
import { usePatchProjectMembers } from "../../api/controllers/projectController";

type UserCardViewProps = {
  user: User;
  teams: Team[];
  projects: Project[];
  onEdit: () => void;
};

export const UserCardView = ({
  user,
  teams,
  projects,
  onEdit,
}: UserCardViewProps) => {
  const deleteUserMutation = useDeleteUser(user.id);
  const updateTeamMembers = usePatchTeamUsers();
  const updateProjectMembers = usePatchProjectMembers();

  const assignedTeams = teams.filter((team) => team.users.includes(user.id));
  const assignedProjects = projects.filter((project) =>
    project.memberIds.includes(user.id)
  );

  const handleDelete = async () => {
    console.log("hi");
    await deleteUserMutation.mutateAsync();

    assignedTeams.map(async (t) => {
      updateTeamMembers.mutateAsync({
        teamId: t.id,
        users: t.users.filter((id) => id !== user.id),
      });
    });

    assignedProjects.map(async (p) => {
      updateProjectMembers.mutateAsync({
        projectId: p.id,
        memberIds: p.memberIds.filter((id) => id !== p.id),
      });
    });
  };

  return (
    <>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography variant="body2" color="text.secondary">
              First Name
            </Typography>
            <Typography variant="body1">{user.firstName}</Typography>
            <Typography variant="body2" color="text.secondary">
              Last Name
            </Typography>
            <Typography variant="body1">{user.lastName}</Typography>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{user.email}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Display Name
            </Typography>
            <Typography variant="body1">{user.displayName}</Typography>
            <Typography variant="body2" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body1">
              {user.createdAt && !isNaN(new Date(user.createdAt).getTime())
                ? new Date(user.createdAt).toLocaleString()
                : "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Updated At
            </Typography>
            <Typography variant="body1">
              {user.updatedAt && !isNaN(new Date(user.updatedAt).getTime())
                ? new Date(user.updatedAt).toLocaleString()
                : "N/A"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Assigned in teams:
            </Typography>
            <Typography variant="body1">
              {assignedTeams.map((team) => team.name).join(", ")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Assigned in projects:
            </Typography>
            <Typography variant="body1">
              {assignedProjects.map((project) => project.name).join(", ")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administrator:
            </Typography>
            <Typography variant="body1">
              {user.isAdmin ? "Yes" : "No"}
            </Typography>
          </Grid>
          <Grid
            size={{ xs: 12, sm: 1 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "flex-start", sm: "flex-end" },
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Button variant="contained" sx={{ minWidth: 110 }} onClick={onEdit}>
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ minWidth: 110 }}
              onClick={() => handleDelete()}
            >
              Delete
            </Button>
            <Button sx={{ minWidth: 110 }}>May be for later</Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
