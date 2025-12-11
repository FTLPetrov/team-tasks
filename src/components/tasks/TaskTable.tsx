/* eslint-disable react-hooks/set-state-in-effect */
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useGetAllTasks } from "../../api/controllers/tasksController";
import { useGetAllUsers } from "../../api/controllers/userController";
import { Box, Pagination } from "@mui/material";
import { TaskDialogFormButton } from "./TaskDialogFormButton";
import { TaskDeleteButton } from "./TaskDeleteButton";
import { useEffect, useMemo, useState } from "react";
import type { Filters } from "./FilterTasksButtons";

type Props = {
  filters: Filters;
};

export const TaskTable = ({ filters }: Props) => {
  const { data: rows = [] } = useGetAllTasks();
  const { data: users = [] } = useGetAllUsers();
  const [page, setPage] = useState(1);
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const rowsPerPage = 5;

  const filteredRows = useMemo(() => {
    return rows.filter((task) => {
      const matchesTitle = filters.title
        ? task.title?.toLowerCase().includes(filters.title.toLowerCase())
        : true;
      const matchesDescription = filters.description
        ? task.description
            ?.toLowerCase()
            .includes(filters.description.toLowerCase())
        : true;
      const matchesStatus = filters.status
        ? task.status === filters.status
        : true;
      const matchesPriority = filters.priority
        ? task.priority === filters.priority
        : true;
      const matchesAssigned = filters.assignedId
        ? task.assignedUserId === filters.assignedId
        : true;

      return (
        matchesTitle &&
        matchesDescription &&
        matchesStatus &&
        matchesPriority &&
        matchesAssigned
      );
    });
  }, [rows, filters]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const lastPerPage = page * rowsPerPage;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Title</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Priority</TableCell>
            <TableCell align="center">Assigned member</TableCell>
            <TableCell align="center">Created At</TableCell>
            <TableCell align="center">Updated</TableCell>
            <TableCell align="center">Operations</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows
            .slice(lastPerPage - rowsPerPage, lastPerPage)
            .map((task) => {
              const assignedMember = users.find(
                (user) => user.id === task.assignedUserId
              )?.displayName;

              return (
                <TableRow
                  key={task.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{task.title}</TableCell>
                  <TableCell component="th" scope="row">
                    {task.description}
                  </TableCell>
                  <TableCell align="center">{task.status}</TableCell>
                  <TableCell align="center">{task.priority}</TableCell>
                  <TableCell align="center">{assignedMember}</TableCell>
                  <TableCell align="center">{task.createdAt}</TableCell>
                  <TableCell align="center">{task.updatedAt}</TableCell>
                  <TableCell align="center">
                    <Box display={"flex"} justifyContent={"flex-end"} gap={1}>
                      <TaskDeleteButton task={task} />
                      <TaskDialogFormButton task={task} />
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <Pagination
        count={Math.ceil(filteredRows.length / rowsPerPage)}
        page={page}
        onChange={handleChange}
      />
    </TableContainer>
  );
};
