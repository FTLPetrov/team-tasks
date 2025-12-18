import { Card, CardContent, Typography } from "@mui/material";
import type { Project } from "../../api/types/projectTypes";
import { ViewProjectDetailsButton } from "./ViewProjectDetailsButton";

type ProjectCardProps = {
  project: Project;
  name: string;
  description?: string;
  onViewDetails?: (projectId: string) => void;
};

export const ProjectCard = ({
  project,
  name,
  description,
  onViewDetails,
}: ProjectCardProps) => {
  return (
    <Card
      sx={{
        minWidth: 275,
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: 1
      }}
    >
      <CardContent
        sx={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: 1 }}
      >
        <Typography variant="h6">{name}</Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          {description}
        </Typography>

        <ViewProjectDetailsButton
          onClick={() => onViewDetails?.(project.id)}
          sx={{ mt: "auto", alignSelf: "flex-start" }}
        >
          View Details
        </ViewProjectDetailsButton>
      </CardContent>
    </Card>
  );
};
