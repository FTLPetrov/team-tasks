/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import type { User } from "../../api/types/userTypes";
import {
  TaskPriority,
  TaskStatus,
  type Task,
  type TaskPriority as TaskPriorityValue,
  type TaskStatus as TaskStatusValue,
} from "../../api/types/taskTypes";

export type TaskDialogFormValues = {
  title: string;
  description: string;
  status: TaskStatusValue;
  priority: TaskPriorityValue;
  dueDate: string;
  assignedUserId: number;
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  task?: Task | null;
  users: User[];
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: TaskDialogFormValues) => void;
};

export const TaskCreateAndEditDialog = ({
  open,
  mode,
  task = null,
  users,
  isSubmitting = false,
  onClose,
  onSubmit,
}: Props) => {
  const isEdit = mode === "edit";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatusValue>(TaskStatus.TODO);
  const [priority, setPriority] = useState<TaskPriorityValue>(
    TaskPriority.MEDIUM
  );
  const [assignee, setAssignee] = useState<User | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [startDateDisplay, setStartDateDisplay] = useState<string | null>(null);
  const [completedAtDisplay, setCompletedAtDisplay] = useState<string | null>(
    null
  );

  const normalizeStatus = (value?: string | null): TaskStatusValue => {
    if (!value) return TaskStatus.TODO;
    const match = Object.values(TaskStatus).find(
      (option) => option.toLowerCase() === value.toLowerCase()
    );
    return match ?? TaskStatus.TODO;
  };

  const normalizePriority = (value?: string | null): TaskPriorityValue => {
    if (!value) return TaskPriority.MEDIUM;
    const match = Object.values(TaskPriority).find(
      (option) => option.toLowerCase() === value.toLowerCase()
    );
    return match ?? TaskPriority.MEDIUM;
  };

  const toDateInputValue = (value?: string | null) => {
    if (!value) return "";
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
  };

  const formatDisplayDate = (value?: string | null) => {
    if (!value) return null;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("MMM D, YYYY HH:mm") : null;
  };

  useEffect(() => {
    if (!open) return;

    if (!isEdit || !task) {
      setTitle("");
      setDescription("");
      setStatus(TaskStatus.TODO);
      setPriority(TaskPriority.MEDIUM);
      setAssignee(null);
      setDueDate("");
      setStartDateDisplay(null);
      setCompletedAtDisplay(null);
      return;
    }

    setTitle(task.title ?? "");
    setDescription(task.description ?? "");
    setStatus(normalizeStatus(task.status));
    setPriority(normalizePriority(task.priority));
    setAssignee(users.find((user) => user.id === task.assignedUserId) ?? null);
    setDueDate(toDateInputValue(task.dueDate));
    setStartDateDisplay(formatDisplayDate(task.startDate));
    setCompletedAtDisplay(formatDisplayDate(task.completedAt));
  }, [open, isEdit, task, users]);

  const canSubmit =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    Boolean(status) &&
    Boolean(priority) &&
    assignee !== null &&
    dueDate.trim().length > 0;

  const handleSubmit = () => {
    if (!assignee) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate,
      assignedUserId: assignee.id,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit Task" : "Create Task"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            fullWidth
            multiline
            minRows={3}
          />

          <TextField
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
  
            required
          />

          <TextField
            select
            label="Status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as TaskStatusValue)
            }
          >
            {Object.values(TaskStatus).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as TaskPriorityValue)
            }
          >
            {Object.values(TaskPriority).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <Autocomplete
            options={users}
            value={assignee}
            onChange={(_, value) => setAssignee(value)}
            getOptionLabel={(option) => option.displayName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Assigned User" required />
            )}
          />

          {isEdit && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Start Date"
                value={startDateDisplay ?? "-"}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Completed At"
                value={completedAtDisplay ?? "-"}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          {isEdit ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
