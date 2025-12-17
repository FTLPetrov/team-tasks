import { useGetAllUsers } from "../../api/controllers/userController";
import { AdaptiveTable } from "./AdaptiveTable";
import type { User } from "../../api/types/userTypes";
import { Box, Chip, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { useState } from "react";
import { useGetAllTeams } from "../../api/controllers/teamController";
import type { Team } from "../../api/types/teamTypes";
import { useGetAllTasks } from "../../api/controllers/tasksController";
import type { Project } from "../../api/types/projectTypes";
import { useGetAllProjects } from "../../api/controllers/projectsController";

const findUserAndTeam = (users: User[], teams: Team[], userId: string) => {
  const user = users.find((u) => u.id === userId);
  const team = teams.find((t) => t.users.includes(userId));
  return { user, team };
};

const formatAssignee = (users: User[], teams: Team[], userId?: string) => {
  if (!userId) return "Unassigned";

  const { user, team } = findUserAndTeam(users, teams, userId);
  if (!user) return "Unassigned";

  return team ? `${user.displayName} - ${team.name}` : user.displayName;
};

const findProjectName = (projectId: string, projects: Project[]) => {
  return (
    projects.find((project) => project.id === projectId)?.name ?? "Unknown"
  );
};

export const TasksTable = () => {
  const { data: teams = [] } = useGetAllTeams();
  const { data: users = [] } = useGetAllUsers();
  const { data: tasks = [] } = useGetAllTasks();
  const { data: projects = [] } = useGetAllProjects();
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

  const dynamicStatus = tasks.map((x) => x.status);
  const uniqueStatus = Array.from(new Set(dynamicStatus));

  const pieData = uniqueStatus.map((x) => ({
    label: x,
    value: tasks?.filter((y) => y.status === x)?.length,
  }));

  return (
    <Box>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography variant="h4">Tasks</Typography>
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
          rows={tasks}
          columns={[
            {
              columnId: "title",
              columnLabel: "Name",
            },
            {
              columnId: "status",
              columnLabel: "Status",
            },
            {
              columnId: "assignedUserId",
              columnLabel: "Assigned to",
              formatValue: (value) =>
                formatAssignee(users, teams, value as string),
            },
            {
              columnId: "projectId",
              columnLabel: "From project",
              formatValue: (value) =>
                findProjectName(value as string, projects),
            },
            {
              columnId: "createdAt",
              columnLabel: "Created at",
            },
            {
              columnId: "updatedAt",
              columnLabel: "Updated at",
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
          width={500}
          height={500}
        />
      )}
    </Box>
  );
};
