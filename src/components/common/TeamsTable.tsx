import { Box, Chip, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { AdaptiveTable } from "./AdaptiveTable";
import type { Project } from "../../api/types/projectTypes";
import type { User } from "../../api/types/userTypes";
import { useGetAllTeams } from "../../api/controllers/teamController";
import { useGetAllProjects } from "../../api/controllers/projectsController";
import { useState } from "react";
import { useGetAllUsers } from "../../api/controllers/userController";

const getTeamUsageCount = (projects: Project[], teamId: string): number => {
  const result = projects.filter((project) => project.teamIds.includes(teamId));

  return result.length;
};

const getTeamUsageList = (projects: Project[], teamId: string) => {
  const result = projects.filter((project) => project.teamIds.includes(teamId));

  return result.map((p) => p.name).join(", ");
};

const getDisplayNames = (users: User[], userIds: string[]): string => {
  const userDisplayNames = userIds?.map(
    (x) => users.find((y) => y.id === x)?.displayName
  );

  return userDisplayNames?.join(", ");
};

export const TeamsTable = () => {
  const { data: teams = [] } = useGetAllTeams();
  const { data: projects = [] } = useGetAllProjects();
  const { data: users = [] } = useGetAllUsers();
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

  const pieData = teams.map((t) => ({
    id: t.id,
    label: t.name,
    value: getTeamUsageCount(projects, t.id),
  }));

  return (
    <Box>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography variant="h4">Teams</Typography>
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
          rows={teams}
          columns={[
            {
              columnId: "name",
              columnLabel: "Name",
            },
            {
              columnId: "usedInProjectsCount",
              columnLabel: "Used in projects count",
              formatValue: (_value, team) => getTeamUsageCount(projects, team.id),
            },
            {
              columnId: "usedInProjects",
              columnLabel: "Used in projects",
              formatValue: (_value, team) =>
                getTeamUsageList(projects, team.id) || "Not participating",
            },
            {
              columnId: "users",
              columnLabel: "Members",
              formatValue: (value) =>
                getDisplayNames(users, value as unknown as string[]),
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
