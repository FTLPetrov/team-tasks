import { Autocomplete, Box, MenuItem, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetAllUsers } from "../../api/controllers/userController";
import { useGetAllTasks } from "../../api/controllers/tasksController";
import type { User } from "../../api/types/userTypes";
import type { Filters } from "../../utils/types/Filters";

type Props = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

export const FilterTasksButtons = ({ filters, setFilters }: Props) => {
  const { id } = useParams();
  const { data: users = [] } = useGetAllUsers();
  const { data: tasks = [] } = useGetAllTasks();

  const currentTasks = tasks.filter((t) => t.projectId === id);

  const assignedTasks = currentTasks.filter((t) => t.assignedUserId !== "");

  const assignedUserIds = Array.from(
    new Set(assignedTasks.map((t) => t.assignedUserId))
  );

  const assignedUsers: User[] = assignedUserIds
    .map((idToFind) => users.find((u) => u.id === idToFind))
    .filter(Boolean) as User[];

  const selectedUsers = assignedUsers.filter((u) =>
    filters.assignedIds.includes(u.id)
  );

  const handleChange = (field: keyof Filters, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"} gap={1}>
        <TextField
          label="Search title"
          value={filters.title}
          onChange={(e) => handleChange("title", e.target.value)}
          sx={{ maxWidth: 110 }}
          size="small"
        />

        <TextField
          label="Search description"
          value={filters.description}
          onChange={(e) => handleChange("description", e.target.value)}
          sx={{ maxWidth: 190 }}
          size="small"
        />

        <TextField
          label="Status"
          select
          value={filters.status}
          onChange={(e) => handleChange("status", e.target.value)}
          sx={{ minWidth: 90 }}
          size="small"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Todo">Todo</MenuItem>
          <MenuItem value="In-progress">In-progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>

        <TextField
          label="Priority"
          select
          value={filters.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
          sx={{ minWidth: 90 }}
          size="small"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </TextField>

        <Autocomplete
          multiple
          options={assignedUsers}
          sx={{ minWidth: 260 }}
          size="small"
          getOptionLabel={(option) => option.displayName}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          value={selectedUsers}
          onChange={(_e, newValue) =>
            handleChange(
              "assignedIds",
              newValue.map((u) => u.id)
            )
          }
          renderInput={(params) => (
            <TextField {...params} label="Assigned members" />
          )}
        />
      </Box>
    </>
  );
};
