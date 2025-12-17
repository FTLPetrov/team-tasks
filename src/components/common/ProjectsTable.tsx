import { AdaptiveTable } from "./AdaptiveTable";
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

const getProjectTasksCount = (tasks: Task[], projectId: string) => {
  const result = tasks.filter((task) => task.projectId === projectId);

  return result.length;
};

const getCompletedTasksCount = (tasks: Task[], projectId: string) => {
  const result = tasks.filter(
    (task) =>
      task.projectId === projectId && task.status === TaskStatus.COMPLETED
  );

  return result.length;
};

const getTodoTasksCount = (tasks: Task[], projectId: string) => {
  const result = tasks.filter(
    (task) => task.projectId === projectId && task.status === TaskStatus.TODO
  );

  return result.length;
};

const getInProgressTasksCount = (tasks: Task[], projectId: string) => {
  const result = tasks.filter(
    (task) =>
      task.projectId === projectId && task.status === TaskStatus.IN_PROGRESS
  );

  return result.length;
};

const projectMembersCount = (project: Project, teams: Team[]) => {
  const teamIds = project.teamIds;
  const foundTeams = teamIds.map((teamId) =>
    teams.find((t) => t.id === teamId)
  );

  const teamUsersNested = foundTeams.map((t) => t?.users);
  const teamUsersFlat = teamUsersNested.flat();
  const combined = [...project.memberIds, ...teamUsersFlat];
  const unique = Array.from(new Set(combined));
  return unique.length;
};

export const ProjectsTable = () => {
  const { data: teams = [] } = useGetAllTeams();
  const { data: projects = [] } = useGetAllProjects();
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

  const pieData = projects.map((p) => ({
    id: p.id,
    label: p.name,
    value: getProjectTasksCount(tasks, p.id),
  }));

  return (
    <Box>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography variant="h4">Projects</Typography>
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
          rows={projects}
          columns={[
            {
              columnId: "name",
              columnLabel: "Name",
            },
            {
              columnId: "status",
              columnLabel: "Status",
            },
            {
              columnId: "taskCount",
              columnLabel: "Tasks count",
              formatValue: (_value, project) =>
                getProjectTasksCount(tasks, project.id),
            },
            {
              columnId: "completedTasks",
              columnLabel: "Completed tasks count",
              formatValue: (_value, project) =>
                getCompletedTasksCount(tasks, project.id),
            },
            {
              columnId: "todoTasks",
              columnLabel: "Todo tasks count",
              formatValue: (_value, project) =>
                getTodoTasksCount(tasks, project.id),
            },
            {
              columnId: "inProgressTasks",
              columnLabel: "Tasks in progress count",
              formatValue: (_value, project) =>
                getInProgressTasksCount(tasks, project.id),
            },
            {
              columnId: "memberIds",
              columnLabel: "Members count",
              formatValue: (_value, project) =>
                projectMembersCount(project, teams),
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
