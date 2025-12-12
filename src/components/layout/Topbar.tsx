import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../../utils/hooks/useAuth";
import { useNavigate } from "react-router-dom";

type TopbarProps = {
  title?: string;
};

export const Topbar = ({ title = "Team Management" }: TopbarProps) => {
  const { user, logout } = useAuth();
  const displayName = user?.displayName ?? "";
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography sx={{ flexGrow: 1 }} variant="h6" noWrap component="div">
          {title}
        </Typography>
        <Box display={"flex"} justifyContent={"space-between"} gap={2}>
          <Typography sx={{ flexGrow: 1 }} variant="h6">
            {displayName ? `Welcome, ${displayName}` : "Welcome"}
          </Typography>
          <Button
            variant="contained"
            color="info"
            onClick={() => navigate(`/users/${user?.id}`)}
          >
            Profile
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
