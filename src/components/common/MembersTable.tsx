import { useGetAllUsers } from "../../api/controllers/userController";
import { AdaptiveTable } from "./AdaptiveTable";
import type { User } from "../../api/types/userTypes";
import { Box, Chip, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { useState } from "react";
import { useGetAllProjects } from "../../api/controllers/projectsController";
import { useGetAllTeams } from "../../api/controllers/teamController";
import type { Team } from "../../api/types/teamTypes";
import type { Project } from "../../api/types/projectTypes";
import type { Task } from "../../api/types/taskTypes";
import { useGetAllTasks } from "../../api/controllers/tasksController";
import { TaskStatus } from "../../utils/types/TaskStatus";

const getTeamParticipationList = (teams: Team[], userId: string) => {
  const result = teams.filter((team) => team.users.includes(userId));

  return result.map((t) => t.name).join(", ");
};

const getProjectParticipationList = (projects: Project[], userId: string) => {
  const result = projects.filter((project) =>
    project.memberIds.includes(userId)
  );

  return result.map((p) => p.name).join(", ");
};

const getAssignedTasksCount = (tasks: Task[], userId: string) => {
  const result = tasks.filter((task) => task.assignedUserId === userId);

  return result.length;
};

const getCompletedTasksCount = (tasks: Task[], userId: string) => {
  const result = tasks.filter(
    (task) =>
      task.assignedUserId === userId && task.status === TaskStatus.COMPLETED
  );

  return result.length;
};

export const MembersTable = () => {
  const { data: teams = [] } = useGetAllTeams();
  const { data: projects = [] } = useGetAllProjects();
  const { data: users = [] } = useGetAllUsers();
  const { data: tasks = [] } = useGetAllTasks();
  const [isSwitch, setIsSwitch] = useState("table");
  const switchToChart = () => {
    if (isSwitch == "table") {
      setIsSwitch("chart");
    }
  };
  const switchToTable = () => {
    if (isSwitch == "chart") {
      setIsSwitch("table");
    }
  };

  const pieData = users.map((u) => ({
    id: u.id,
    label: u.displayName,
    value: getAssignedTasksCount(tasks, u.id),
  }));

  return (
    <Box >
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography variant="h4">Members</Typography>
        <Box display={"flex"} justifyContent={"space-between"} gap={1}>
          <Chip
            label="Table"
            variant="filled"
            onClick={switchToTable}
            color="primary"
          />
          <Chip
            label="Chart"
            variant="filled"
            onClick={switchToChart}
            color="primary"
          />
        </Box>
      </Box>
      {isSwitch === "table" ? (
        <AdaptiveTable
          rows={(users as User[]) || undefined}
          columns={[
            {
              columnId: "displayName",
              columnLabel: "Name",
            },
            {
              columnId: "teamsParticipation",
              columnLabel: "Participating in teams",
              formatValue: (_value, user) =>
                getTeamParticipationList(teams, user.id) || "not",
            },
            {
              columnId: "projectsParticipation",
              columnLabel: "In projects",
              formatValue: (_value, user) =>
                getProjectParticipationList(projects, user.id) || "not",
            },
            {
              columnId: "totalTasksCount",
              columnLabel: "Assigned tasks count",
              formatValue: (_value, user) =>
                getAssignedTasksCount(tasks, user.id) || "not",
            },
            {
              columnId: "completedTasksCount",
              columnLabel: "Completed tasks count",
              formatValue: (_value, user) =>
                getCompletedTasksCount(tasks, user.id),
            },
          ]}
        />
      ) : (
        <PieChart
          series={[
            {
              data: pieData,
            },
          ]}
          width={200}
          height={200}
        />
      )}
    </Box>
  );
};
