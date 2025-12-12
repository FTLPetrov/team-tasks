import { Box } from "@mui/material";
import { ProfileView } from "../components/users/ProfileView";
import { ProfileEdit } from "../components/users/ProfileEdit";

export const ProfilePage = () => {
  return (
    <>
      <Box>
        <ProfileEdit />
      </Box>
    </>
  );
};
