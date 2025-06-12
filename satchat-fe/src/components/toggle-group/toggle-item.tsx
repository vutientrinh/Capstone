import { cn } from "@/lib/utils";
import { Typography } from "@mui/material";
import React from "react";

interface ToggleItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const ToggleItem: React.FC<ToggleItemProps> = ({
  label,
  isActive,
  onClick,
}) => {
  return (
    <button
      className={cn(
        "flex-1 py-2 px-4 text-center rounded-[100px] transition-all duration-200",
        "border-2 border-transparent hover:border-primary",
        isActive
          ? "grey border-2 border-primary shadow-sm text-primary font-medium"
          : "text-neutral-700 hover:bg-neutral3-40"
      )}
      onClick={onClick}
    >
      <Typography
        sx={{ color: "var(--foreground)" }}
        className={`font-medium opacity-75 text-content ${
          isActive ? "text-highlight font-semibold opacity-100" : ""
        }`}
      >
        {label}
      </Typography>
    </button>
  );
};
