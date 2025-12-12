import { Button, Card, CardContent, Typography } from "@mui/material";
import type { Project } from "../../api/types/projectTypes";
import { useNavigate } from "react-router-dom";

type ProjectCardProps = {
  project: Project;
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        minWidth: 275,
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: 1,
        }}
      >
        <Typography variant="h6" component="div">
          {project.name}
        </Typography>

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
          {project.description}
        </Typography>
        <Button
          onClick={() => navigate(`/projects/${project.id}`)}
          variant="contained"
          size="small"
          sx={{ mt: "auto", alignSelf: "flex-start" }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
