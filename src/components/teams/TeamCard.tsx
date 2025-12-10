import { Card, CardActions, CardContent, Typography } from "@mui/material";

import type { Team } from "../../api/types/teamTypes";
import { DeleteTeamButton } from "./DeleteTeamButton";
import { useGetAllUsers } from "../../api/controllers/userController";
import { useAuth } from "../../utils/hooks/useAuth";
import { TeamDialogFormButton } from "./TeamDialogFormButton";

type TeamCardProps = {
  team: Team;
};

export const TeamCard = ({ team }: TeamCardProps) => {
  const user = useAuth();
  const { data: users = [] } = useGetAllUsers();
  const members = team.users.map(
    (userToFind) => users.find((user) => user.id === userToFind)?.displayName
  );

  const owner = users.find((user) => user.id === team.owner)?.displayName;

  const isOwner = team.owner === user.user?.id;

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {team.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Members: {members.join(", ")}
        </Typography>

        <Typography variant="caption" color="text.secondary" display="block">
          Created: {new Date(team.createdAt).toLocaleDateString()}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Updated: {new Date(team.updatedAt).toLocaleDateString()}
        </Typography>
        <Typography>Owner: {owner}</Typography>
      </CardContent>

      <CardActions>
        {isOwner ? (
          <>
            <TeamDialogFormButton team={team} />
            <DeleteTeamButton team={team} />
          </>
        ) : null}
      </CardActions>
    </Card>
  );
};
