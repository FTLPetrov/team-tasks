import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import type { User } from "../../api/types/userTypes";
import type { Team } from "../../api/types/teamTypes";
import type { Project } from "../../api/types/projectTypes";
import { useUpdateUser } from "../../api/controllers/userController";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../../utils/validation";
import { usePatchTeamUsers } from "../../api/controllers/teamController";
import { usePatchProjectMembers } from "../../api/controllers/projectController";

type UserCardEditProps = {
  user: User;
  teams: Team[];
  projects: Project[];
  onCancel: () => void;
  onSaved?: () => void;
  isSubmitting: boolean;
};

type EditFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
  isAdmin: boolean;
  assignedTeams: number[];
  assignedProjects: number[];
};

export const UserCardEdit = ({
  user,
  onCancel,
  onSaved,
  teams,
  projects,
}: UserCardEditProps) => {
  const updateUserMutation = useUpdateUser(user.id);
  const patchTeamUsersMutation = usePatchTeamUsers();
  const patchProjectMembersMutation = usePatchProjectMembers();

  const currentTeamIds = teams
    .filter((t) => t.users.includes(user.id))
    .map((t) => t.id);

  const currentProjectIds = projects
    .filter((p) => p.memberIds.includes(user.id))
    .map((p) => p.id);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditFormValues>({
    mode: "onChange",
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      displayName: user.displayName ?? "",
      password: user.secret ?? "",
      confirmPassword: user.secret ?? "",
      isAdmin: user.isAdmin ?? false,
      assignedTeams: currentTeamIds,
      assignedProjects: currentProjectIds,
    },
  });

  const password = useWatch({ control, name: "password" });

  const onSubmit = async (data: EditFormValues) => {
    const userData = {
      id: user.id,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      displayName: data.displayName.trim(),
      secret: data.password,
      createdAt: user.createdAt,
      updatedAt: new Date().toISOString(),
      isAdmin: data.isAdmin,
    };
    await updateUserMutation.mutateAsync(userData);

    const nextTeamIds = data.assignedTeams;

    const newTeamIds = nextTeamIds.filter((id) => !currentTeamIds.includes(id));
    const removedTeamIds = currentTeamIds.filter(
      (id) => !nextTeamIds.includes(id)
    );

    const hasTeamChange = newTeamIds.length > 0 || removedTeamIds.length > 0;

    if (hasTeamChange) {
      await Promise.all([
        ...newTeamIds.map(async (teamId) => {
          const team = teams.find((t) => t.id === teamId);
          if (!team) return;

          const nextUsers = Array.from(new Set([...team.users, user.id]));
          await patchTeamUsersMutation.mutateAsync({
            teamId,
            users: nextUsers,
          });
        }),
        ...removedTeamIds.map(async (teamId) => {
          const team = teams.find((t) => t.id === teamId);
          if (!team) return;

          const nextUsers = team.users.filter((userId) => userId !== user.id);
          await patchTeamUsersMutation.mutateAsync({
            teamId,
            users: nextUsers,
          });
        }),
      ]);
    }

    const nextProjectIds = data.assignedProjects;

    const newProjectIds = nextProjectIds.filter(
      (id) => !currentProjectIds.includes(id)
    );
    const removedProjectIds = currentProjectIds.filter(
      (id) => !nextProjectIds.includes(id)
    );

    const hasProjectChange =
      newProjectIds.length > 0 || removedProjectIds.length > 0;

    if (hasProjectChange) {
      await Promise.all([
        ...newProjectIds.map(async (projectId) => {
          const project = projects.find((p) => p.id === projectId);
          if (!project) return;
          const nextMembers = Array.from(
            new Set([...project.memberIds, user.id])
          );
          await patchProjectMembersMutation.mutateAsync({
            projectId,
            memberIds: nextMembers,
          });
        }),
        ...removedProjectIds.map(async (projectId) => {
          const project = projects.find((p) => p.id === projectId);
          if (!project) return;
          const nextMembers = project.memberIds.filter(
            (memberId) => memberId !== user.id
          );
          await patchProjectMembersMutation.mutateAsync({
            projectId,
            memberIds: nextMembers,
          });
        }),
      ]);
    }

    onSaved?.();
  };

  return (
    <>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Stack spacing={2}>
                <TextField
                  label="First Name"
                  fullWidth
                  {...register("firstName", {
                    required: "First name is required",
                    validate: validateName,
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
                <TextField
                  label="Last Name"
                  fullWidth
                  {...register("lastName", {
                    required: "Last name is required",
                    validate: validateName,
                  })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
                <TextField
                  label="Email"
                  fullWidth
                  {...register("email", {
                    required: "Email is required",
                    validate: validateEmail,
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Stack spacing={2}>
                <TextField
                  label="Display Name"
                  fullWidth
                  {...register("displayName", {
                    required: "Display name is required",
                  })}
                  error={!!errors.displayName}
                  helperText={errors.displayName?.message}
                />
                <TextField
                  label="Password"
                  fullWidth
                  type="password"
                  {...register("password", { validate: validatePassword })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                <TextField
                  label="Confirm Password"
                  fullWidth
                  type="password"
                  {...register("confirmPassword", {
                    validate: (value: string) =>
                      value === password || "Passwords do not match",
                  })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Stack spacing={2}>
                <Controller
                  control={control}
                  name="assignedTeams"
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      options={teams}
                      getOptionLabel={(t) => t.name ?? `Team #${t.id}`}
                      value={teams.filter((t) =>
                        (field.value ?? []).includes(t.id)
                      )}
                      onChange={(_, selected) =>
                        field.onChange(selected.map((t) => t.id))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Assigned Teams"
                          placeholder="Select teams"
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="assignedProjects"
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      options={projects}
                      getOptionLabel={(p) => p.name ?? `Project #${p.id}`}
                      value={projects.filter((p) =>
                        (field.value ?? []).includes(p.id)
                      )}
                      onChange={(_, selected) =>
                        field.onChange(selected.map((p) => p.id))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Assigned Projects"
                          placeholder="Select projects"
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="isAdmin"
                  render={({ field }) => (
                    <FormControlLabel
                      label="Is Admin"
                      control={
                        <Switch
                          checked={!!field.value}
                          onChange={(_, checked) => field.onChange(checked)}
                        />
                      }
                    />
                  )}
                />
              </Stack>
            </Grid>
            <Stack spacing={2} flexGrow={1}>
              <Grid
                size={{ xs: 12, sm: 4 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "flex-start", sm: "flex-end" },
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ minWidth: 110 }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ minWidth: 110 }}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button sx={{ minWidth: 110 }}>May be for later</Button>
              </Grid>
            </Stack>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};
