"use client";

import { cn } from "@/lib/utils";
import { relativeTime } from "@/utils/relative-time";
import { Avatar, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { postStore } from "@/store/reducers";
import { IMGAES_URL } from "@/global-config";

interface TrendingPostCardProps {
  className?: string;
  post: any;
  content: string;
  image: string;
  alt: string;
  time: string;
  author: any;
  topic: any;
}

export const TrendingPostCard: React.FC<TrendingPostCardProps> = ({
  className,
  post,
  content,
  image,
  alt,
  time,
  author,
  topic,
}) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(postStore.actions.setCurrentPost(post));
  };
  return (
    <Link href={`/post/${alt}`} legacyBehavior>
      <a href="#" onClick={handleClick}>
        <div
          className={cn(
            "relative bg-neutral2-2 rounded-[1.25rem] p-3 flex items-center gap-4 hover:bg-neutral2-5 focus:border-[3px] focus:border-neutral2-10",
            className
          )}
        >
          <Image
            className="rounded-[0.5rem] row-span-2 items-center"
            src={image}
            alt={alt}
            width={100}
            height={100}
            style={{
              minWidth: "7rem",
              maxHeight: "6rem",
              minHeight: "6rem",
              objectFit: "cover",
            }}
          />
          <div className="flex flex-col gap-3">
            <Typography className="text-primary opacity-80 line-clamp-2 font-semibold">
              {content}
            </Typography>
            {author && (
              <div className="flex items-center justify-start gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 ml-1">
                    <div
                      className="p-1 rounded-full"
                      style={{
                        backgroundColor: `${
                          topic.color ? topic.color : "#ffffff"
                        }`,
                      }}
                    ></div>
                    <Typography className="text-tertiary text-sm">
                      {topic.name}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      id="avatar-user"
                      className="flex w-fit justify-start items-start"
                    >
                      <Avatar
                        src={author?.avatar ? IMGAES_URL + author.avatar : ""}
                        alt={author.username}
                        sx={{ width: 20, height: 20 }}
                      />
                    </div>
                    <Typography className="opacity-45 text-tertiary text-sm">
                      {relativeTime(new Date(time))}
                    </Typography>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
};
