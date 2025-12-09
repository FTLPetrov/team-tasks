import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useGetAllUsers } from "../api/controllers/userController";
import { useGetAllTeams } from "../api/controllers/teamController";
import {
  useGetProjectById,
  useUpdateProject,
} from "../api/controllers/projectsController";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { User } from "../api/types/userTypes";
import type { Team } from "../api/types/teamTypes";
import { ProjectStatus } from "../utils/types/ProjectStatus";

type ProjectDetailsEditProps = {
  onSaved?: () => void;
};

export const ProjectDetailsEdit = ({ onSaved }: ProjectDetailsEditProps) => {
  const { id } = useParams<{ id: string }>();
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useGetProjectById(id ?? "");
  const { data: users = [], isLoading: usersLoading } = useGetAllUsers();
  const { data: teams = [], isLoading: teamsLoading } = useGetAllTeams();

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedAdmins, setSelectedAdmins] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { mutateAsync: mutateAsyncUpdate } = useUpdateProject(
    project?.id || ""
  );
  const [projectStatus, setProjectStatus] = useState(project?.status);

  useEffect(() => {
    if (!project) return;
    setProjectName(project.name ?? "");
    setProjectDescription(project.description ?? "");
  }, [project]);

  useEffect(() => {
    if (!project || users.length === 0) return;
    setSelectedAdmins(
      users.filter((user) => project.adminIds.includes(user.id))
    );
    setSelectedMembers(
      users.filter((user) => project.memberIds.includes(user.id))
    );
  }, [project, users]);

  useEffect(() => {
    if (!project || teams.length === 0) return;
    setSelectedTeams(teams.filter((team) => project.teamIds.includes(team.id)));
  }, [project, teams]);

  if (isLoading || usersLoading || teamsLoading) {
    return <Typography color="text.secondary">Loading project...</Typography>;
  }

  if (isError) {
    return (
      <Typography color="error">
        Failed to load project: {error?.message || "Unknown error"}
      </Typography>
    );
  }

  if (!project) {
    return <Typography color="text.secondary">Project not found.</Typography>;
  }

  const handleSave = async () => {
    if (!project) return;
    setIsSaving(true);
    try {
      await mutateAsyncUpdate({
        name: projectName,
        description: projectDescription,
        createdAt: project.createdAt,
        updatedAt: new Date().toLocaleDateString(),
        teamIds: selectedTeams.map((team) => team.id),
        adminIds: selectedAdmins.map((admin) => admin.id),
        memberIds: selectedMembers.map((member) => member.id),
        status: projectStatus,
      });
      onSaved?.();
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setProjectStatus(event.target.value as ProjectStatus);
  };

  return (
    <Box>
      <Grid
        container
        spacing={3}
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Grid size={4} display={"flex"} flexDirection={"column"}>
          <TextField
            label="Project name"
            variant="outlined"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            margin="dense"
          />
          <TextField
            label="Description"
            variant="outlined"
            value={projectDescription}
            onChange={(event) => setProjectDescription(event.target.value)}
            margin="dense"
            multiline
            minRows={3}
          />
        </Grid>
        <Grid size={4} display={"flex"} flexDirection={"column"} gap={2}>
          <Autocomplete
            multiple
            options={users}
            value={selectedAdmins}
            onChange={(_event, newValue) => setSelectedAdmins(newValue)}
            getOptionLabel={(option) => option.displayName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Admins" />
            )}
          />
          <Autocomplete
            multiple
            options={teams}
            value={selectedTeams}
            onChange={(_event, newValue) => setSelectedTeams(newValue)}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Teams" />
            )}
          />
          <Autocomplete
            multiple
            options={users}
            value={selectedMembers}
            onChange={(_event, newValue) => setSelectedMembers(newValue)}
            getOptionLabel={(option) => option.displayName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Members" />
            )}
          />
        </Grid>
        <Grid size={4}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={projectStatus}
              label="Status"
              onChange={handleChange}
            >
              {Object.values(ProjectStatus).map((value) => (
                <MenuItem value={value}>{value}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="h6" color="text.secondary" display="block">
            Created:{" "}
            {project && new Date(project.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="h6" color="text.secondary" display="block">
            Updated:{" "}
            {project && new Date(project.updatedAt).toLocaleDateString()}
          </Typography>
        </Grid>
        <Grid size={12}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
