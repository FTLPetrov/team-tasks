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
        <Typography variant="body1" sx={{ mr: 2 }}>
          {displayName ? `Welcome, ${displayName}` : "Welcome"}
        </Typography>
        <Box display={"flex"} justifyContent={"space-between"} gap={2}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => navigate(`/profile`)}
          >
            View Profile
          </Button>
          <Button color="error" variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
