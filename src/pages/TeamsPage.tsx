import { Box, Button, Stack, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import {
  useCreateTeam,
  useDeleteTeam,
  useGetAllTeams,
  useUpdateTeam,
} from "../api/controllers/teamController";
import type { Team } from "../api/types/teamTypes";
import { useGetAllUsers } from "../api/controllers/userController";
import { useState } from "react";
import { TeamCreateAndEditDialog } from "../components/team/TeamCreateAndEditDialog";
import { DeleteTeamDialog } from "../components/team/DeleteTeamDialog";
import { useAuth } from "../auth/AuthProvider";
import dayjs from "dayjs";

export const TeamsPage = () => {
  const { data: teams, isLoading } = useGetAllTeams();
  const { data: users } = useGetAllUsers();
  const { user } = useAuth();
  const currentUserId = user?.id;

  const visibleTeams = teams?.filter((t) => {
    if (!currentUserId) return false;
    if (user?.isAdmin) return true;
    return t.owner === currentUserId || t.users.includes(currentUserId);
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [deleteTeamById, setDeleteTeamById] = useState<number | null>(null);

  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam(
    editTeam?.id ?? 0
  );
  const deleteTeamMutation = useDeleteTeam(deleteTeamById ?? 0);

  const rows: Team[] = visibleTeams ?? [];

  const columns: GridColDef<Team>[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
    {
      field: "users",
      headerName: "Users",
      flex: 1,
      valueGetter: (_value, row) =>
        row.users
          .map((id) => users?.find((user) => user.id === id)?.displayName)
          .join(", "),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      valueGetter: (_value, row) =>
        dayjs(row.createdAt).format("YYYY-MM-DD HH:mm"),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 1,
      valueGetter: (_value, row) =>
        dayjs(row.updatedAt).format("YYYY-MM-DD HH:mm"),
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 180,
      align: "center",
      renderCell: (params) => {
        const team = params.row;

        if (team.owner === currentUserId || user?.isAdmin) {
          return (
            <Stack
              direction={"row"}
              spacing={1}
              justifyContent="center"
              alignItems="center"
              sx={{ height: "100%", width: "100%" }}
            >
              <Button
                size="small"
                variant="contained"
                onClick={() => setEditTeam(team)}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => setDeleteTeamById(team.id)}
              >
                Delete
              </Button>
            </Stack>
          );
        }
      },
    },
  ];

  const handleSubmit = async (payload: { name: string; userIds: number[] }) => {
    if (editTeam) {
      await updateTeamMutation.mutateAsync({
        id: editTeam.id,
        name: payload.name.trim(),
        users: payload.userIds,
        owner: editTeam.owner,
        createdAt: editTeam.createdAt,
        updatedAt: new Date().toISOString(),
      } satisfies Partial<Team>);

      setEditTeam(null);
      return;
    }
    if (!currentUserId) return;

    await createTeamMutation.mutateAsync({
      name: payload.name.trim(),
      users: payload.userIds,
      owner: currentUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } satisfies Partial<Team>);

    setCreateOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTeamById) return;

    await deleteTeamMutation.mutateAsync();
    setDeleteTeamById(null);
  };

  return (
    <>
      <Typography>Teams</Typography>

      <Stack direction="row" justifyContent="flex-start" sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          Create team
        </Button>
      </Stack>

      <Box sx={{ height: 520, width: "100%" }}>
        <DataGrid<Team>
          rows={rows}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          disableRowSelectionOnClick
        />

        <TeamCreateAndEditDialog
          open={createOpen || !!editTeam}
          mode={editTeam ? "edit" : "create"}
          team={editTeam || null}
          users={users ?? []}
          onClose={() => {
            setCreateOpen(false);
            setEditTeam(null);
          }}
          onSubmit={handleSubmit}
        />

        <DeleteTeamDialog
          open={deleteTeamById !== null}
          team={teams?.find((t) => t.id === deleteTeamById)}
          loading={deleteTeamMutation.isPending}
          onClose={() => setDeleteTeamById(null)}
          onConfirm={handleDeleteConfirm}
        />
      </Box>
    </>
  );
};
