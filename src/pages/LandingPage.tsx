import { Box, Button, Chip, Typography } from "@mui/material";
import { AdaptiveTable } from "../components/common/AdaptiveTable";
import { useGetAllTeams } from "../api/controllers/teamController";
import { useGetAllUsers } from "../api/controllers/userController";
import type { User } from "../api/types/userTypes";
import { useGetAllProjects } from "../api/controllers/projectsController";
import type { Project } from "../api/types/projectTypes";
import { PieChart } from "@mui/x-charts/PieChart";
import { useMemo, useState } from "react";

const getDisplayNames = (users: User[], userIds: string[]): string => {
  const userDisplayNames = userIds?.map(
    (x) => users.find((y) => y.id === x)?.displayName
  );

  return userDisplayNames?.join(", ");
};

const getTeamUsageCount = (projects: Project[], teamId: string): number => {
  const result = projects.filter((project) => project.teamIds.includes(teamId));

  return result.length;
};

const getTeamUsageList = (projects: Project[], teamId: string) => {
  const result = projects.filter((project) => project.teamIds.includes(teamId));

  return result.map((p) => p.name).join(", ");
};

export const LandingPage = () => {
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
    <>
      <Box display={"flex"} flexDirection={"row"} alignItems={"flex-start"} gap={4} justifyContent={"center"}> 
        <Box width={750}>
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
                  columnId: "id",
                  columnLabel: "Used in projects count",
                  formatValue: (value) => getTeamUsageCount(projects, value),
                },
                {
                  columnId: "id",
                  columnLabel: "Used in projects",
                  formatValue: (value) =>
                    getTeamUsageList(projects, value) || "Not participating",
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
        <Box width={750}>
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
                  columnId: "id",
                  columnLabel: "Used in projects count",
                  formatValue: (value) => getTeamUsageCount(projects, value),
                },
                {
                  columnId: "id",
                  columnLabel: "Used in projects",
                  formatValue: (value) =>
                    getTeamUsageList(projects, value) || "Not participating",
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
      </Box>
    </>
  );
};

// rows={rows?.map((x) => ({
//   id: x.id,
//   name: x.name,
//   members: x.users
//     ?.map((y) => users.find((z) => z.id === y)?.displayName)
//     ?.join(", "),
//   createdDate: x.createdAt,
//   second: `${x.name} - ${x.updatedAt}`,
// }))}
{
  /* <AdaptiveTable
    rows={rows}
    titles={["Id", "Name", "Members", "Created at", "Updated At", "Owner"]}
    keys={["id", "name", "users", "createdAt", "updatedAt", "owner"]}
    valueMaps={{
      users: userMap, 
      owner: userMap, 
    }}
  /> */
}
