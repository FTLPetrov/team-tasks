import { Box } from "@mui/material";
import { TeamsTable } from "../components/common/TeamsTable";
import { MembersTable } from "../components/common/MembersTable";
import { ProjectsTable } from "../components/common/ProjectsTable";
import { TasksTable } from "../components/common/TasksTable";

export const LandingPage = () => {
  const grids = [
    { id: "members", content: <MembersTable /> },
    { id: "Projects", content: <ProjectsTable /> },
    { id: "Teams", content: <TeamsTable /> },
    { id: "Tasks", content: <TasksTable /> },
  ];

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }}
        gap={{ xs: 3, md: 4 }}
        alignItems="stretch"
      >
        {grids.map(({ id, content }) => (
          <Box key={id}>{content}</Box>
        ))}
      </Box>
    </>
  );
};
