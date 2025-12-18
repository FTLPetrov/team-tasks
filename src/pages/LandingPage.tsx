import { Grid } from "@mui/material";
import { TeamsTable } from "../components/common/TeamsTable";
import { MembersTable } from "../components/common/MembersTable";
import { ProjectsTable } from "../components/common/ProjectsTable";
import { TasksTable } from "../components/common/TasksTable";

export const LandingPage = () => {

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          "& > .MuiGrid-root": {
            border: "5px solid #1976d2",
            borderRadius: 5,
            p: 2,
          },
        }}
      >
        <Grid size={{ xs: 6, md: 6 }}>
          <MembersTable />
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <ProjectsTable />
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <TeamsTable />
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <TasksTable />
        </Grid>
      </Grid>
    </>
  );
};
