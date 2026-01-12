/* eslint-disable react-hooks/set-state-in-render */
import { UserCardView } from "./UserCardView";
import { UserCardEdit } from "./UserCardEdit";
import type { User } from "../../api/types/userTypes";
import type { Team } from "../../api/types/teamTypes";
import type { Project } from "../../api/types/projectTypes";

export type UserCardProps = {
  user: User;
  teams: Team[];
  projects: Project[];

  isEditing: boolean;
  isSubmitting: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
};

export function UserCard({
  user,
  teams,
  projects,
  isEditing,
  isSubmitting,
  onStartEdit,
  onCancelEdit,
}: UserCardProps) {
  if (isEditing) {
    return (
      <UserCardEdit
        user={user}
        isSubmitting={isSubmitting}
        onCancel={onCancelEdit}
        onSaved={onCancelEdit}
        teams={teams}
        projects={projects}
      />
    );
  }

  return (
    <UserCardView
      user={user}
      teams={teams}
      projects={projects}
      onEdit={onStartEdit}
    />
  );
}
