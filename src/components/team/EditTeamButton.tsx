import { Button } from "@mui/material";

type Props = { onClick: () => void; disabled?: boolean };

export const EditTeamButton = ({ onClick, disabled }: Props) => (
  <Button size="small" variant="contained" onClick={onClick} disabled={disabled}>
    Edit
  </Button>
);
