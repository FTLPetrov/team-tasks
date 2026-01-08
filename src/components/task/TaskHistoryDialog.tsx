import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import dayjs from "dayjs";
import { useGetAllTaskHistory } from "../../api/controllers/taskHistoryController";
import { useGetAllUsers } from "../../api/controllers/userController";
import type { Task, TaskHistoryEntry } from "../../api/types/taskTypes";

type Props = {
  open: boolean;
  onClose: () => void;
  task: Task | null;
};

export const TaskHistoryDialog = ({ open, onClose, task }: Props) => {
  const { data: allHistory, isLoading } = useGetAllTaskHistory();
  const { data: users } = useGetAllUsers();

  const entriesForTask: TaskHistoryEntry[] =
    allHistory?.filter((entry) => entry.taskId === task?.id) ?? [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Task history{task ? ` – ${task.title}` : ""}</DialogTitle>
      <DialogContent dividers>
        {!task && <Typography variant="body2">No task selected.</Typography>}

        {task && isLoading && (
          <Typography variant="body2">Loading history…</Typography>
        )}

        {task && !isLoading && entriesForTask.length === 0 && (
          <Typography variant="body2">
            No history entries recorded for this task yet.
          </Typography>
        )}

        {task && !isLoading && entriesForTask.length > 0 && (
          <List sx={{ mt: 1 }}>
            {entriesForTask
              .slice()
              .sort(
                (a, b) =>
                  dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
              )
              .map((entry) => (
                <ListItem key={entry.id} alignItems="flex-start">
                  <ListItemText
                    primary={`${dayjs(entry.createdAt).format(
                      "MMM D, YYYY HH:mm:ss"
                    )} – ${
                      users?.find((u) => u.id === entry.createdBy)
                        ?.displayName ?? "Unknown user"
                    }`}
                    secondary={
                      <Box component="span" sx={{ display: "block", mt: 0.5 }}>
                        {entry.diff.map((d) => (
                          <Typography
                            key={d.field}
                            variant="body2"
                            component="div"
                          >
                            <strong>{d.field}</strong>:{" "}
                            {String(d.previousValue)}
                            {" → "}
                            {String(d.nextValue)}
                          </Typography>
                        ))}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
