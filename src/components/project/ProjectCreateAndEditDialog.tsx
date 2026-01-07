/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { ProjectStatus, type Project } from "../../api/types/projectTypes";
import type { User } from "../../api/types/userTypes";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import type { Team } from "../../api/types/teamTypes";
import type { Post } from "../../api/types/postTypes";
import { useGetAllPosts } from "../../api/controllers/postController";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  project?: Project | null;
  users: User[];
  teams: Team[];

  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    description: string;
    teamIds: number[];
    adminIds: number[];
    memberIds: number[];
    status: ProjectStatus;
    posts: number[];
  }) => void;
};

export const ProjectCreateAndEditDialog = ({
  open,
  mode,
  project = null,
  users,
  teams,
  onClose,
  onSubmit,
}: Props) => {
  const isEdit = mode === "edit";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const [selectedAdmins, setSelectedAdmins] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.ACTIVE);
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  const { data: posts } = useGetAllPosts();

  const preselectedTeams = useMemo(() => {
    if (!project) return [];
    const ids = new Set(project.teamIds ?? []);
    return teams.filter((team) => ids.has(team.id));
  }, [project, teams]);

  const preselectedAdmins = useMemo(() => {
    if (!project) return [];
    const ids = new Set(project.adminIds ?? []);
    return users.filter((user) => ids.has(user.id));
  }, [project, users]);

  const preselectedMembers = useMemo(() => {
    if (!project) return [];
    const ids = new Set(project.memberIds ?? []);
    return users.filter((user) => ids.has(user.id));
  }, [project, users]);

  const preselectedPosts = useMemo(() => {
    if (!project || !posts) return [];
    const ids = new Set(project.posts ?? []);
    return posts.filter((post) => ids.has(post.id));
  }, [project, posts]);

  useEffect(() => {
    if (!open) return;

    if (!isEdit) {
      setName("");
      setDescription("");
      setSelectedTeams([]);
      setSelectedAdmins([]);
      setSelectedMembers([]);
      setStatus(ProjectStatus.ACTIVE);
      setSelectedPosts([]);
      return;
    }

    setName(project?.name ?? "");
    setDescription(project?.description ?? "");
    setSelectedTeams(preselectedTeams);
    setSelectedAdmins(preselectedAdmins);
    setSelectedMembers(preselectedMembers);
    setStatus(project?.status ?? ProjectStatus.ACTIVE);
    setSelectedPosts(preselectedPosts ?? []);
  }, [
    open,
    isEdit,
    project,
    preselectedTeams,
    preselectedAdmins,
    preselectedMembers,
    preselectedPosts
  ]);

  const canSubmit = name.trim().length > 0;

  const handleSubmit = () => {
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      teamIds: selectedTeams.map((team) => team.id),
      adminIds: selectedAdmins.map((user) => user.id),
      memberIds: selectedMembers.map((user) => user.id),
      status,
      posts: selectedPosts.map((p) => p.id),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit Project" : "Create Project"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            fullWidth
          />
          <Autocomplete
            multiple
            options={teams}
            value={selectedTeams}
            onChange={(_, value) => setSelectedTeams(value)}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Teams" placeholder="Select teams" />
            )}
          />
          <Autocomplete
            multiple
            options={users}
            value={selectedAdmins}
            onChange={(_, value) => setSelectedAdmins(value)}
            getOptionLabel={(option) => option.displayName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Project admins"
                placeholder="Select admins"
              />
            )}
          />
          <Autocomplete
            multiple
            options={users}
            value={selectedMembers}
            onChange={(_, value) => setSelectedMembers(value)}
            getOptionLabel={(option) => option.displayName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Project members"
                placeholder="Select members"
              />
            )}
          />
          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          >
            {Object.values(ProjectStatus).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <Autocomplete
            multiple
            options={posts || []}
            value={selectedPosts}
            onChange={(_, value) => setSelectedPosts(value)}
            getOptionLabel={(option) => option.title}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Project posts"
                placeholder="Select posts"
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {isEdit ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
