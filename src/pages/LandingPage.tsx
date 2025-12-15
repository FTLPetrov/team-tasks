import { Box } from "@mui/material";
import { AdaptiveTable } from "../components/common/AdaptiveTable";
import { useGetAllTeams } from "../api/controllers/teamController";
import { useGetAllUsers } from "../api/controllers/userController";
import type { User } from "../api/types/userTypes";

const getDisplayNames = (users: User[], userIds: string[]) => {
  const userDisplayNames = userIds?.map(
    (x) => users.find((y) => y.id === x)?.displayName
  );

  return userDisplayNames?.join(", ");
};

export const LandingPage = () => {
  const { data: rows = [] } = useGetAllTeams();
  const { data: users = [] } = useGetAllUsers();

  return (
    <Box>
      <AdaptiveTable
        rows={rows}
        columns={[
          { columnId: "id", columnLabel: "Id" },
          { columnId: "name", columnLabel: "Name" },
          {
            columnId: "users",
            columnLabel: "Members",
            formatValue: (value) =>
              getDisplayNames(users, value as unknown as string[]),
            columnTextStyle: { fontSize: 16, color: "purple" },
            rowCellTextStyle: { fontWeight: "bold", fontSize: 12 },
          },
          { columnId: "createdAt", columnLabel: "Created at" },
        ]}
        // rows={rows?.map((x) => ({
        //   id: x.id,
        //   name: x.name,
        //   members: x.users
        //     ?.map((y) => users.find((z) => z.id === y)?.displayName)
        //     ?.join(", "),
        //   createdDate: x.createdAt,
        //   second: `${x.name} - ${x.updatedAt}`,
        // }))}
      />
      {/* <AdaptiveTable
        rows={rows}
        titles={["Id", "Name", "Members", "Created at", "Updated At", "Owner"]}
        keys={["id", "name", "users", "createdAt", "updatedAt", "owner"]}
        valueMaps={{
          users: userMap, 
          owner: userMap, 
        }}
      /> */}
    </Box>
  );
};
