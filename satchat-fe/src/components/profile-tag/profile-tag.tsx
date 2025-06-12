"use client";

import { cn } from "@/lib/utils";
import { Avatar, Button, Typography } from "@mui/material";
import Link from "next/link";
import { AddIcon } from "../icons";
import React from "react";

interface ProfileCardProps {
  className?: string;
  user: any;
  types?: "follower" | "following";
  hasFollowedBack: boolean;
  onFollow?: () => void;
}

export const ProfileTag: React.FC<ProfileCardProps> = ({
  className,
  user,
  types,
  onFollow,
}) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  return (
    <Link href={`/profile/${user.id}`}>
      <div
        className={cn(
          "bg-neutral2-2 rounded-[1.25rem] p-1 flex flex-col justify-between gap-3 hover:bg-neutral2-5 transition-colors duration-200",
          "border border-transparent hover:border-neutral2-10 focus-within:border-[3px] focus-within:border-primary",
          className
        )}
      >
        <div className="profile-info flex items-center gap-3 rounded-full p-2 transition-colors">
          <div id="avatar-user" className="relative">
            <Avatar
              src={user.avatar ? user.avatar : "/img/default-avatar.jpg"}
              alt={`Avatar of ${user.username}`}
              className="size-[44px] ring-2 ring-offset-2 ring-neutral2-10"
              sx={{
                width: 44,
                height: 44,
                fontSize: "1.5rem",
              }}
            />
            {user.isOnline && (
              <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="grow flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Typography
                className="text-primary font-semibold line-clamp-1"
                sx={{ color: "inherit" }}
              >
                {user.firstName} {user.lastName}
              </Typography>
              {user.isVerified && (
                <span className="text-blue-500 size-4 flex items-center justify-center">
                  ✓
                </span>
              )}
            </div>
            <Typography
              className="text-tertiary text-sm opacity-80"
              sx={{ color: "inherit" }}
            >
              @{user.username}
            </Typography>
          </div>
        </div>
      </div>
    </Link>
  );
};
