"use client";

import { cn } from "@/lib";
import { Avatar, Typography } from "@mui/material";
import React from "react";

export const Button = ({
  onClick,
  displayText,
  isOnline,
  countUnSeen,
  avatarUrl = "/img/avatar_default.jpg",
  latestMessage = "Let's discuss this tomorrow",
  latestUpdateTime = "10:35 AM",
}: {
  onClick: () => void;
  displayText: string;
  isOnline: boolean;
  countUnSeen: number;
  avatarUrl: string;
  latestMessage?: string;
  latestUpdateTime?: string;
}) => {
  return (
    <div>
      <div
        className={cn(
          "bg-neutral2-2 rounded-[1.25rem] p-2 flex flex-col justify-between gap-3",
          "hover:bg-[var(--button-hover)]",
          "border border-transparent hover:border-neutral2-10",
          "focus-within:border-[3px] focus-within:border-primary"
        )}
        onClick={onClick}
      >
        <div className="profile-info flex items-center gap-3 rounded-full p-2 transition-colors">
          <div id="avatar-user" className="relative">
            <Avatar
              src={avatarUrl}
              alt={`Avatar of ${displayText}`}
              className="size-[44px] ring-2 ring-offset-2 ring-neutral2-10"
              sx={{ width: 44, height: 44, fontSize: "1.5rem" }}
            />
            {isOnline && (
              <span
                suppressHydrationWarning
                className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white"
              />
            )}
          </div>
          <div className="grow flex flex-col gap-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <Typography
                className="text-primary font-semibold line-clamp-1"
                sx={{ color: "inherit" }}
              >
                <strong>{displayText}</strong>
              </Typography>
              <Typography
                className="text-xs text-gray-400 ml-2"
                sx={{ whiteSpace: "nowrap" }}
              >
                {latestUpdateTime}
              </Typography>
            </div>
            <div className="flex items-center justify-between">
              <Typography
                className="text-sm text-gray-500 truncate max-w-[80%]"
                title={latestMessage}
              >
                {latestMessage}
              </Typography>
              {countUnSeen > 0 && (
                <span className="text-xs text-white bg-red-500 rounded-full px-2 py-0.5 ml-2">
                  {countUnSeen}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
