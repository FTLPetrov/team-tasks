import { Box, Button, Stack, Typography } from "@mui/material";
import {
  useCreateProject,
  useDeleteProject,
  useGetAllProjects,
  useUpdateProject,
} from "../api/controllers/projectController";
import { useGetAllUsers } from "../api/controllers/userController";
import { DataGrid, type GridColDef, type GridEventListener } from "@mui/x-data-grid";
import type { Project, ProjectStatus } from "../api/types/projectTypes";
import dayjs from "dayjs";
import { useGetAllTeams } from "../api/controllers/teamController";
import { DeleteProjectDialog } from "../components/project/DeleteProjectDialog";
import { useState } from "react";
import { ProjectCreateAndEditDialog } from "../components/project/ProjectCreateAndEditDialog";
import { useGetAllPosts } from "../api/controllers/postController";
import { useNavigate } from "react-router-dom";

export const ProjectsPage = () => {
  const { data: projects, isLoading } = useGetAllProjects();
  const { data: users } = useGetAllUsers();
  const { data: teams } = useGetAllTeams();

  const {data: posts} = useGetAllPosts();
  console.log(posts)

  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProjectById, setDeleteProjectById] = useState<number | null>(
    null
  );

  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject(editProject?.id ?? 0);
  const deleteProjectMutation = useDeleteProject(deleteProjectById ?? 0);

  const navigate = useNavigate()

  const rows: Project[] = projects ?? [];

  const columns: GridColDef<Project>[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
    { field: "description", headerName: "Description", flex: 1, minWidth: 180 },
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
      field: "teamIds",
      headerName: "Working teams",
      flex: 1,
      valueGetter: (_value, row) =>
        row.teamIds
          .map((id) => teams?.find((team) => team.id === id)?.name)
          .join(", "),
    },
    {
      field: "adminIds",
      headerName: "Admins",
      flex: 1,
      valueGetter: (_value, row) =>
        row.adminIds
          .map((id) => users?.find((user) => user.id === id)?.displayName)
          .join(", "),
    },
    {
      field: "memberIds",
      headerName: "Members",
      flex: 1,
      valueGetter: (_value, row) =>
        row.memberIds
          .map((id) => users?.find((user) => user.id === id)?.displayName)
          .join(", "),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "posts",
      headerName: "Posts",
      flex: 1,
      valueGetter: (_value, row) =>
        row.posts
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 180,
      align: "center",
      renderCell: (params) => {
        const project = params.row;

        return (
          <Stack
            direction={"row"}
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%", width: "100%" }}
          >
            <Button variant="contained" onClick={() => setEditProject(project)}>
              {" "}
              Edit{" "}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setDeleteProjectById(project.id)}
            >
              Delete
            </Button>
          </Stack>
        );
      },
    },
  ];

  const handleSubmit = async (payload: {
    name: string;
    description: string;
    teamIds: number[];
    adminIds: number[];
    memberIds: number[];
    status: ProjectStatus;
    posts: number[];
  }) => {
    if (editProject) {
      await updateProjectMutation.mutateAsync({
        id: editProject.id,
        name: payload.name,
        description: payload.description,
        teamIds: payload.teamIds,
        adminIds: payload.adminIds,
        memberIds: payload.memberIds,
        status: payload.status,
        posts: payload.posts,
        createdAt: editProject.createdAt,
        updatedAt: new Date().toISOString(),
      } satisfies Partial<Project>);

      setEditProject(null);
      return;
    }

    await createProjectMutation.mutateAsync({
      name: payload.name,
      description: payload.description,
      teamIds: payload.teamIds,
      adminIds: payload.adminIds,
      memberIds: payload.memberIds,
      status: payload.status,
      posts: payload.posts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } satisfies Partial<Project>);

    setCreateOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProjectById) return;

    await deleteProjectMutation.mutateAsync();
    setDeleteProjectById(null);
  };

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    navigate(`/projects/${params.id}`);
  };

  return (
    <>
      <Typography>Projects</Typography>

      <Button variant="contained" onClick={() => setCreateOpen(true)}>
        Create
      </Button>

      <Box sx={{ height: 520, width: "100%" }}>
        <DataGrid<Project>
          getRowId={(row) => row.id}
          rows={rows}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          onRowClick={handleRowClick}
        />
      </Box>

      <ProjectCreateAndEditDialog
        open={createOpen || !!editProject}
        mode={editProject ? "edit" : "create"}
        project={editProject || null}
        users={users ?? []}
        teams={teams ?? []}
        onClose={() => {
          setCreateOpen(false);
          setEditProject(null);
        }}
        onSubmit={handleSubmit}
      />

      <DeleteProjectDialog
        open={deleteProjectById !== null}
        project={projects?.find((p) => p.id === deleteProjectById)}
        loading={deleteProjectMutation.isPending}
        onClose={() => setDeleteProjectById(null)}
        onConfirm={handleDeleteConfirm}
      ></DeleteProjectDialog>
    </>
  );
};
