import { Button } from "@mui/material";

type CreateTeamButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export const CreateTeamButton = ({
  onClick,
  disabled,
}: CreateTeamButtonProps) => {
  return (
    <Button variant="contained" onClick={onClick} disabled={disabled}>
      Create team
    </Button>
  );
};
