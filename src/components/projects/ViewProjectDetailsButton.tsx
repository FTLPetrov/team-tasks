import { Button, type ButtonProps } from "@mui/material";
import type { ReactNode } from "react";

type Props = {
  onClick: () => void | Promise<void>;
  children?: ReactNode;
} & ButtonProps;

export function ViewProjectDetailsButton({
  onClick,
  children = "View details",
  ...buttonProps
}: Props) {
  return (
    <Button variant="contained" onClick={onClick} {...buttonProps}>
      {children}
    </Button>
  );
}
