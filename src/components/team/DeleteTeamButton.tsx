import { Button } from "@mui/material";

type DeleteTeamButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export const DeleteTeamButton = ({
  onClick,
  disabled,
}: DeleteTeamButtonProps) => {
  return (
    <Button size="small" color="error" variant="contained" onClick={onClick} disabled={disabled}>
      Delete
    </Button>
  );
};
