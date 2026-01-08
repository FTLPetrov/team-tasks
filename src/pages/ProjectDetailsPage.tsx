import { useParams } from "react-router-dom";
import { useGetProjectById } from "../api/controllers/projectController";
import { Box, Grid, Paper, Snackbar, Typography } from "@mui/material";
import { useGetAllComments } from "../api/controllers/commentController";
import dayjs from "dayjs";
import { useGetAllPosts } from "../api/controllers/postController";
import { useGetAllTeams } from "../api/controllers/teamController";
import { useGetAllUsers } from "../api/controllers/userController";
import {
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "../api/controllers/taskController";
import {
  TaskStatus,
  type Task,
  type TaskHistoryEntry,
} from "../api/types/taskTypes";
import { TaskSectionView } from "../components/task/TaskSectionView";
import {
  TaskCreateAndEditDialog,
  type TaskDialogFormValues,
} from "../components/task/TaskCreateAndEditDialog";
import { DeleteTaskDialog } from "../components/task/DeleteTaskDialog";
import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useCreateTaskHistory } from "../api/controllers/taskHistoryController";
import { TaskHistoryDialog } from "../components/task/TaskHistoryDialog";

export const ProjectDetailsPage = () => {
  const { user: authUser } = useAuth();
  const { id } = useParams();
  const { data: project } = useGetProjectById(Number(id));
  const { data: comments } = useGetAllComments();
  const { data: posts } = useGetAllPosts();
  const { data: teams } = useGetAllTeams();
  const { data: users } = useGetAllUsers();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState<Task | null>(null);
  const [taskBeingDeleted, setTaskBeingDeleted] = useState<Task | null>(null);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask(taskBeingEdited?.id ?? 0);
  const deleteTaskMutation = useDeleteTask(taskBeingDeleted?.id ?? 0);
  const createTaskHistory = useCreateTaskHistory();
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [taskForHistory, setTaskForHistory] = useState<Task | null>(null);
  const [taskChangeToastOpen, setTaskChangeToastOpen] = useState(false);

  const normalizeDueDate = (value: string) => {
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.startOf("day").toISOString() : null;
  };

  const handleOpenCreateTask = () => {
    setTaskBeingEdited(null);
    setTaskDialogOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setTaskBeingEdited(task);
    setTaskDialogOpen(true);
  };

  const handleOpenDeleteTask = (task: Task) => {
    setTaskBeingDeleted(task);
  };

  const handleCloseTaskDialog = () => {
    setTaskDialogOpen(false);
    setTaskBeingEdited(null);
  };

  const handleCloseDeleteDialog = () => {
    setTaskBeingDeleted(null);
  };

  const handleDeleteTask = async () => {
    if (!taskBeingDeleted) return;

    await deleteTaskMutation.mutateAsync();
    setTaskBeingDeleted(null);
  };

  const handleCloseTaskChangeToast = () => {
    setTaskChangeToastOpen(false);
  };

  const handleTaskSubmit = async (payload: TaskDialogFormValues) => {
    if (!project?.id || !taskBeingEdited || !authUser?.id) return;

    const now = new Date().toISOString();
    const dueDate = normalizeDueDate(payload.dueDate);
    if (!dueDate) return;

    const before = taskBeingEdited;
    const shouldSetStartDate =
      !before.startDate && payload.status !== before.status;

    const updatedTask = await updateTaskMutation.mutateAsync({
      ...before,
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
      assignedUserId: payload.assignedUserId,
      dueDate,
      startDate: shouldSetStartDate ? now : before.startDate ?? null,
      completedAt:
        payload.status === TaskStatus.COMPLETED
          ? now
          : before.completedAt ?? null,
      updatedAt: now,
    });

    const after = updatedTask;
    const diff: TaskHistoryEntry["diff"] = [];

    const addDiff = (
      field: keyof Task,
      previousValue: string | number | null | undefined,
      nextValue: string | number | null | undefined
    ) => {
      if (previousValue === nextValue) return;
      diff.push({
        field,
        previousValue: previousValue ?? null,
        nextValue: nextValue ?? null,
      });
    };

    addDiff("title", before.title, after.title);
    addDiff("description", before.description, after.description);
    addDiff("status", before.status, after.status);
    addDiff("priority", before.priority, after.priority);
    addDiff("assignedUserId", before.assignedUserId, after.assignedUserId);
    addDiff("dueDate", before.dueDate, after.dueDate);
    addDiff("startDate", before.startDate, after.startDate);
    addDiff("completedAt", before.completedAt, after.completedAt);
    addDiff("updatedAt", before.updatedAt, after.updatedAt);

    if (diff.length) {
      await createTaskHistory.mutateAsync({
        taskId: after.id,
        createdAt: now,
        createdBy: authUser.id,
        beforeSnapshot: before,
        afterSnapshot: after,
        diff,
      });
    }
    setTaskChangeToastOpen(true);

    handleCloseTaskDialog();
  };

  const handleOpenHistoryDialog = (task: Task) => {
    setTaskForHistory(task);
    setHistoryDialogOpen(true);
  };

  const handleCloseHistoryDialog = () => {
    setHistoryDialogOpen(false);
    setTaskForHistory(null);
  };

  const filteredComments = comments?.filter((c) =>
    project?.posts?.includes(c.postId)
  );

  const postTitles = posts?.filter((post) => project?.posts?.includes(post.id));

  return (
    <>
      <Box>
        <Box sx={{ mt: 2, p: 2, border: 1, borderRadius: 4 }}>
          <Typography variant="h6">Project Details</Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }}>Name: {project?.name}</Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              Description: {project?.description}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              Created at:{" "}
              {project?.createdAt
                ? dayjs(project.createdAt).format("MMM D, YYYY")
                : "-"}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              Created at:{" "}
              {project?.updatedAt
                ? dayjs(project.updatedAt).format("MMM D, YYYY")
                : "-"}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              Working teams:{" "}
              {project?.teamIds
                ?.map(
                  (teamId) =>
                    teams?.find((team) => team.id === teamId)?.name ?? null
                )
                .filter((name): name is string => Boolean(name))
                .join(", ") || "-"}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              Admins:{" "}
              {project?.adminIds
                ?.map(
                  (adminId) =>
                    users?.find((user) => user.id === adminId)?.displayName ??
                    null
                )
                .filter((name): name is string => Boolean(name))
                .join(", ") || "-"}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              Members:{" "}
              {project?.memberIds
                ?.map(
                  (memberId) =>
                    users?.find((user) => user.id === memberId)?.displayName ??
                    null
                )
                .filter((name): name is string => Boolean(name))
                .join(", ") || "-"}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>Status: {project?.status}</Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              Posts: {postTitles?.map((post) => post.title).join(", ") || "-"}
            </Grid>
          </Grid>
        </Box>

        <TaskSectionView
          projectId={project?.id}
          onCreateTask={handleOpenCreateTask}
          onEditTask={handleOpenEditTask}
          onDeleteTask={handleOpenDeleteTask}
          showHistory={handleOpenHistoryDialog}
        />

        <TaskCreateAndEditDialog
          open={taskDialogOpen}
          mode={taskBeingEdited ? "edit" : "create"}
          task={taskBeingEdited}
          users={users ?? []}
          isSubmitting={
            createTaskMutation.isPending || updateTaskMutation.isPending
          }
          onClose={handleCloseTaskDialog}
          onSubmit={handleTaskSubmit}
        />

        <DeleteTaskDialog
          open={!!taskBeingDeleted}
          task={taskBeingDeleted}
          loading={deleteTaskMutation.isPending}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteTask}
        />

        <TaskHistoryDialog
          open={historyDialogOpen}
          onClose={handleCloseHistoryDialog}
          task={taskForHistory}
        />

        <Snackbar
          open={taskChangeToastOpen}
          autoHideDuration={6000}
          onClose={handleCloseTaskChangeToast}
          message="Change saved successfully"
        />

        <Box sx={{ mt: 2, p: 2, border: 1, borderRadius: 4 }}>
          <Typography variant="h6">Comments</Typography>

          {filteredComments?.length ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {filteredComments.map(({ id, name, email, body }) => (
                <Grid key={id} size={{ xs: 12, sm: 6 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                    }}
                  >
                    <Typography variant="subtitle1" noWrap>
                      {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {email}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {body}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" sx={{ mt: 1 }}>
              No comments for this project.
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};
