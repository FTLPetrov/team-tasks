import { Box, Button, Chip, Grid, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useGetAllTasks } from "../../api/controllers/taskController";
import { useGetAllUsers } from "../../api/controllers/userController";
import { TaskStatus, type Task } from "../../api/types/taskTypes";

type Props = {
  projectId?: number;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  onCreateTask?: () => void;
  showHistory?: () => void;
};

export const TaskSectionView = ({
  projectId,
  onEditTask,
  onDeleteTask,
  onCreateTask,
  showHistory,
}: Props) => {
  const { data: tasks } = useGetAllTasks();
  const { data: users } = useGetAllUsers();
  const filteredTasks = tasks?.filter((task) => task.projectId === projectId);
  const shouldScrollTasks = (filteredTasks?.length ?? 0) > 10;

  const formatDate = (value?: string | null, withTime = false) => {
    if (!value) return "-";
    const parsed = dayjs(value);
    if (!parsed.isValid()) return "-";
    return parsed.format(withTime ? "MMM D, YYYY HH:mm" : "MMM D, YYYY");
  };

  const getDueStatusChip = (task: Task) => {
    if (!task.dueDate) return null;
    const due = dayjs(task.dueDate);
    if (!due.isValid()) return null;

    const formatLag = (diffMinutes: number) => {
      const abs = Math.abs(diffMinutes);
      const days = Math.floor(abs / (24 * 60));
      const hours = Math.floor((abs % (24 * 60)) / 60);
      const parts: string[] = [];
      if (days) parts.push(`${days}d`);
      if (hours || parts.length === 0) parts.push(`${hours}h`);
      return parts.join(" ");
    };

    if (task.status === TaskStatus.COMPLETED && task.completedAt) {
      const completed = dayjs(task.completedAt);
      if (!completed.isValid()) return null;
      const diffMinutes = completed.diff(due, "minute");
      const metDeadline = diffMinutes <= 0;
      return {
        label: metDeadline
          ? "Completed on time"
          : `Late by ${formatLag(diffMinutes)}`,
        color: metDeadline ? "success" : "error",
      } as const;
    }

    if (task.status !== TaskStatus.COMPLETED && due.isBefore(dayjs())) {
      const diffMinutes = dayjs().diff(due, "minute");
      return {
        label: `Past due by ${formatLag(diffMinutes)}`,
        color: "error",
      } as const;
    }

    return null;
  };

  return (
    <>
      <Box sx={{ mt: 2, p: 2, border: 1, borderRadius: 4 }}>
        <Box display={"flex"} gap={2} justifyContent={"space-between"}>
          <Typography variant="h6">Tasks</Typography>
          <Button variant="contained" onClick={onCreateTask}>
            Create task
          </Button>
        </Box>

        {filteredTasks?.length ? (
          <Box
            sx={
              (shouldScrollTasks && {
                mt: 1,
                maxHeight: 520,
                overflowY: "auto",
                pr: 1,
              }) || { mt: 1 }
            }
          >
            <Grid container spacing={2}>
              {filteredTasks.map((task) => {
                const {
                  id,
                  title,
                  description,
                  status,
                  priority,
                  assignedUserId,
                  createdAt,
                  updatedAt,
                  startDate,
                  dueDate,
                  completedAt,
                } = task;

                const dueChip = getDueStatusChip(task);

                return (
                  <Grid key={id} size={{ xs: 12 }}>
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
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Typography>Title: {title}</Typography>
                          <Typography>Description: {description}</Typography>
                          <Typography>
                            Assigned user:{" "}
                            {users?.find((u) => u.id === assignedUserId)
                              ?.displayName ?? "-"}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Typography>
                            Created At: {formatDate(createdAt)}
                          </Typography>
                          <Typography>
                            Updated At: {formatDate(updatedAt)}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 2 }}>
                          <Box display="flex" gap={1} flexWrap="wrap">
                            <Chip label={status ?? "Unknown"} />
                            <Chip label={priority ?? "Unknown"} />
                            {dueChip && (
                              <Chip
                                label={dueChip.label}
                                color={dueChip.color}
                                variant={
                                  dueChip.color === "success"
                                    ? "outlined"
                                    : "filled"
                                }
                              />
                            )}
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Typography>
                            Start Date: {formatDate(startDate, true)}
                          </Typography>
                          <Typography>
                            Due Date: {formatDate(dueDate)}
                          </Typography>
                          <Typography>
                            Completed At: {formatDate(completedAt, true)}
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
                          <Button
                            size="small"
                            variant="contained"
                            sx={{ minWidth: 110 }}
                            onClick={() => onEditTask?.(task)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            sx={{ minWidth: 110 }}
                            onClick={() => onDeleteTask?.(task)}
                          >
                            Delete
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            sx={{ minWidth: 110 }}
                            onClick={() => showHistory?.()}
                          >
                            History
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mt: 1 }}>
            No tasks for this project.
          </Typography>
        )}
      </Box>
    </>
  );
};
