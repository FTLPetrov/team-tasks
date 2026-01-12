import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import GroupIcon from "@mui/icons-material/Group";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

const drawerWidth = 240;

const navItems = [
  { label: "Home", path: "/", icon: <InboxIcon /> },
  { label: "Teams", path: "/teams", icon: <MailIcon /> },
  { label: "Projects", path: "/projects", icon: <InboxIcon /> },
  { label: "Users", path: "/users", icon: <GroupIcon /> },
];

export const Sidebar = () => {
  const { user } = useAuth();
  const visibleNavItems = navItems.filter((item) => {
    if (item.path !== "/users") return true;
    return user?.isAdmin === true;
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {visibleNavItems.map((item) => (
            <ListItemButton key={item.label} component={NavLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
