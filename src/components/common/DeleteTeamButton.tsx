/* eslint-disable react-hooks/set-state-in-effect */
import { Button } from "@mui/material";
import { useDeleteTeam } from "../../api/controllers/teamController";
import type { Team } from "../../api/types/teamTypes";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { AlertDialog } from "./AlertDialog";

type DeleteTeamButtonProps = {
  team: Team;
};

export const DeleteTeamButton = ({ team }: DeleteTeamButtonProps) => {
  const { mutateAsync } = useDeleteTeam(team.id);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpen = () => setIsDialogOpen(true);
  const handleClose = () => setIsDialogOpen(false);

  const handleSubmit = () => {
    mutateAsync();
    handleClose();
  };

  return (
    <>
      <Button
        size="small"
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={handleOpen}
      />
      <AlertDialog
        open={isDialogOpen}
        tilte={"Attention"}
        message={`Are you sure that you want to delete team: ${team.name}`}
        onClose={handleClose}
        onConfirm={handleSubmit}
      />
    </>
  );
};
