import { useEffect, useState } from "react";
import {
  useCreateTask,
  useUpdateTask,
} from "../../api/controllers/tasksController";
import type { Task } from "../../api/types/taskTypes";
import { useGetAllUsers } from "../../api/controllers/userController";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  type SelectChangeEvent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { TaskStatus } from "../../utils/types/TaskStatus";
import { TaskPriority } from "../../utils/types/TaskPriority";
import { useParams } from "react-router-dom";
import { useGetProjectById } from "../../api/controllers/projectsController";

type Props = {
  task?: Task;
};

export const TaskDialogFormButton = ({ task }: Props) => {
  const { mutateAsync: mutateAsyncCreate } = useCreateTask();
  const { mutateAsync: mutateAsyncUpdate } = useUpdateTask(task?.id || "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: users = [] } = useGetAllUsers();
  const { id } = useParams();
  const { data: project } = useGetProjectById(id!);

  const [taskTitle, setTaskTitle] = useState(task?.title);
  const [taskDescription, setTaskDescription] = useState(task?.description);
  const [taskStatus, setTaskStatus] = useState(task?.status);
  const [taskPriority, setTaskPriority] = useState(task?.priority);
  const [taskAssignedId, setTaskAssignedId] = useState(task?.assignedUserId);

  const currentMembers = project?.memberIds.map((memberToFind) =>
    users.find((user) => user.id === memberToFind)
  );

  const handleChange = (
    event: SelectChangeEvent,
    type: "Status" | "Priority" | "AssignedId"
  ) => {
    if (type == "Status") {
      setTaskStatus(event.target.value as TaskStatus);
    }
    if (type == "Priority") {
      setTaskPriority(event.target.value as TaskPriority);
    }

    if (type == "AssignedId") {
      setTaskAssignedId(event.target.value as string);
    }
  };

  const handleOpen = () => setIsDialogOpen(true);
  const handleClose = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (!isDialogOpen) return;
  }, [isDialogOpen]);

  const handleSubmit = () => {
    if (!taskTitle?.trim()) return;

    if (task) {
      mutateAsyncUpdate({
        title: taskTitle.trim(),
        description: taskDescription?.trim(),
        status: taskStatus,
        priority: taskPriority,
        assignedUserId: taskAssignedId,
        createdAt: task.createdAt,
        updatedAt: new Date().toLocaleDateString(),
      });
    } else {
      mutateAsyncCreate({
        title: taskTitle.trim(),
        description: taskDescription?.trim(),
        status: taskStatus,
        priority: taskPriority,
        assignedUserId: taskAssignedId,
        createdAt: new Date().toLocaleDateString(),
        updatedAt: new Date().toLocaleDateString(),
      });
    }

    handleClose();
  };

  return (
    <>
      {task ? (
        <Button
          size="small"
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleOpen}
        >
          Edit
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Task
        </Button>
      )}
      <Dialog open={isDialogOpen} onClose={handleClose}>
        <DialogTitle>{task ? "Edit task" : "Create you task"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            label="Name your task"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            fullWidth
          />
          <TextField
            required
            margin="dense"
            label="Desription"
            fullWidth
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <Box
            sx={{ mt: 1 }}
            display={"flex"}
            justifyContent={"space-between"}
            gap={1}
          >
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={taskStatus}
                label="Status"
                onChange={(e) => handleChange(e, "Status")}
              >
                {Object.values(TaskStatus).map((value) => (
                  <MenuItem value={value}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={taskPriority}
                label="Priority"
                onChange={(e) => handleChange(e, "Priority")}
              >
                {Object.values(TaskPriority).map((value) => (
                  <MenuItem value={value}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Assigned to</InputLabel>
              <Select
                value={taskAssignedId}
                label="Assigned to"
                onChange={(e) => handleChange(e, "AssignedId")}
              >
                {currentMembers?.map((value) => (
                  <MenuItem value={value?.id}>{value?.displayName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* <Autocomplete
            multiple
            options={users}
            loading={usersLoading}
            value={selectedUsers}
            onChange={(_event, newValue) => setSelectedUsers(newValue)}
            getOptionLabel={(option) => option.displayName}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Add members" />
            )}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
