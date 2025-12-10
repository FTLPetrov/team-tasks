/* eslint-disable react-hooks/set-state-in-effect */
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import type { Team } from "../../api/types/teamTypes";
import { useState, useEffect } from "react";
import {
  useCreateTeam,
  useUpdateTeam,
} from "../../api/controllers/teamController";
import { useGetAllUsers } from "../../api/controllers/userController";
import type { User } from "../../api/types/userTypes";
import { useAuth } from "../../utils/hooks/useAuth";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

type Props = {
  team?: Team;
};

export const TeamDialogFormButton = ({ team }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [teamName, setTeamName] = useState(team?.name);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { mutateAsync: mutateAsyncUpdate } = useUpdateTeam(team?.id || "");
  const { mutateAsync: mutateAsyncCreate } = useCreateTeam();

  const currentUser = useAuth();

  const { data: users = [], isLoading: usersLoading } = useGetAllUsers();

  const handleOpen = () => setIsDialogOpen(true);

  const handleClose = () => {
    setIsDialogOpen(false);
    setTeamName("");
    setSelectedUsers([]);
  };

  useEffect(() => {
    if (!isDialogOpen) return;

    setTeamName(team?.name);

    const preselected = users.filter((u) => team?.users.includes(u.id));
    setSelectedUsers(preselected);
  }, [isDialogOpen, team, users]);

  const handleSubmit = () => {
    if (!teamName?.trim()) return;

    if (team) {
      mutateAsyncUpdate({
        name: teamName.trim(),
        users: selectedUsers.map((u) => u.id),
        createdAt: team?.createdAt,
        updatedAt: new Date().toLocaleDateString(),
        owner: currentUser.user?.id,
      });
    } else {
      mutateAsyncCreate({
        name: teamName.trim(),
        users: selectedUsers.map((u) => u.id),
        createdAt: new Date().toLocaleDateString(),
        updatedAt: new Date().toLocaleDateString(),
        owner: currentUser.user?.id,
      });
    }

    handleClose();
  };

  return (
    <>
      {team ? (
        <Button
          size="small"
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleOpen}
        />
      ) : (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Team
        </Button>
      )}
      <Dialog open={isDialogOpen} onClose={handleClose}>
        <DialogTitle>{team ? "Edit team" : "Create you team"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="Team"
            label="Name your team"
            type="text"
            value={teamName}
            onChange={(pesho) => setTeamName(pesho.target.value)}
            fullWidth
          />
          <Autocomplete
            multiple
            options={users}
            loading={usersLoading}
            value={selectedUsers}
            onChange={(_event, newValue) => setSelectedUsers(newValue)}
            getOptionLabel={(option) => option.displayName}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Add members" />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
