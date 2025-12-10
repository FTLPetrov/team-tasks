import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useGetAllTasks } from "../../api/controllers/tasksController";
import { useGetAllUsers } from "../../api/controllers/userController";
import { Box, Button } from "@mui/material";
import { TaskDialogFormButton } from "./TaskDialogFormButton";
import { TaskDeleteButton } from "./TaskDeleteButton";

export const TaskTable = () => {
  const { data: rows = [] } = useGetAllTasks();
  const { data: users = [] } = useGetAllUsers();

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
          {rows.map((task) => {
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
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    gap={1}
                  >
                    <TaskDeleteButton task={task} />
                    <TaskDialogFormButton task={task} />
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
