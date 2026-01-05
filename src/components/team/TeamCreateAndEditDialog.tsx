/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

import type { Team } from "../../api/types/teamTypes";
import type { User } from "../../api/types/userTypes";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  team?: Team | null;
  users: User[];

  onClose: () => void;
  onSubmit: (payload: { name: string; userIds: number[] }) => void;
};

export const TeamCreateAndEditDialog = ({
  open,
  mode,
  team = null,
  users,
  onClose,
  onSubmit,
}: Props) => {
  const isEdit = mode === "edit";

  const [name, setName] = useState("");
  const [members, setMembers] = useState<User[]>([]);

  const preselectedMembers = useMemo(() => {
    if (!team) return [];
    const ids = new Set(team.users ?? []);
    return users.filter((u) => ids.has(u.id));
  }, [team, users]);

  useEffect(() => {
    if (!open) return;

    if (!isEdit) {
      setName("");
      setMembers([]);
      return;
    }

    setName(team?.name ?? "");
    setMembers(preselectedMembers);
  }, [open, isEdit, team, preselectedMembers]);

  const canSubmit = name.trim().length > 0;

  const handleSubmit = () => {
    onSubmit({
      name: name.trim(),
      userIds: members.map((u) => u.id),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit team" : "Create team"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Team name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />

          <Autocomplete
            multiple
            options={users}
            value={members}
            onChange={(_, value) => setMembers(value)}
            getOptionLabel={(option) => option.displayName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Members"
                placeholder="Select members"
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
