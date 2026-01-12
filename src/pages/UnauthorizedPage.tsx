import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Typography variant="h4">Unauthorized</Typography>
      <Typography color="text.secondary">
        You don’t have permission to view this page.
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          onClick={() => navigate("/", { replace: true })}
        >
          Go Home
        </Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Stack>
    </Stack>
  );
};
