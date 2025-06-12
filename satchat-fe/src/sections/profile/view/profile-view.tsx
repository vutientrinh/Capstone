"use client";

import { InfoUser } from "../profile-components/user-info";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { ToggleGroup } from "@/components/toggle-group";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { profileStore } from "@/store/reducers";
import { Posts } from "@/sections/post";
import { FriendCard } from "@/sections/friends";
import { usePathname } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { EditProfile } from "../profile-components/user-edit";
import { Images } from "@/components/light-box";
import backendClient from "@/utils/BackendClient";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import {
  Captions,
  Download,
  Fullscreen,
  Thumbnails,
  Zoom,
} from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { IMGAES_URL } from "@/global-config";
import { title } from "process";

const filterOptions = [
  { label: "Posts", icon: <ArticleIcon /> },
  { label: "Friends", icon: <PersonIcon /> },
  { label: "Video", icon: <VideoLibraryIcon /> },
  { label: "Photos", icon: <PhotoLibraryIcon /> },
];

export const ProfileView = ({ user }: { user: any }) => {
  const dispatch = useDispatch();
  const pathName = usePathname();
  const [activeTab, setActiveTab] = useState("1");
  const currentUser = useSelector(profileStore.selectCurrentUser);
  const friends = useSelector(profileStore.selectFriends);
  const friendsPagination = useSelector(profileStore.selectPaginationFriends);
  const [edit, setEdit] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>(null);
  // regex edit profile
  const profileEdit = pathName.match(/^\/profile\/([a-f0-9\-]{36})\/edit$/);
  // photo
  const [index, setIndex] = useState<number>(-1);
  const [slides, setSlides] = useState<any>([]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };
  useEffect(() => {
    if (!user?.id) return;
    if (profileEdit) setEdit(true);

    if (pathName === "/profile") {
      dispatch(
        profileStore.getFriends(
          currentUser?.id,
          friendsPagination.currentPage || 1
        )
      );
    } else {
      dispatch(
        profileStore.getFriends(user?.id, friendsPagination.currentPage || 1)
      );
    }
  }, [activeTab, user?.id, currentUser?.id, pathName, dispatch]);

  useEffect(() => {
    if (!user?.id) return;
    setFilter({
      type: null,
      topicName: null,
      authorId: user.id,
      keyword: null,
    });
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    const loadImages = async (userId: string) => {
      try {
        const response: any = await backendClient.getImages(userId);
        const result = response.data;
        const images = result.data.map((slide: any) => ({
          src: `${IMGAES_URL}${slide}`,
          title: slide,
          description: slide,
        }));
        setSlides(images);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    if (activeTab === "3") {
      loadImages(user.id);
    }
  }, [activeTab, user?.id]);

  return (
    <>
      <section className="relative w-full h-fit overflow-hidden">
        <InfoUser
          id={user.id}
          username={user.username}
          firstName={user.firstName}
          lastName={user.lastName}
          avatar={user.avatar}
          isFollowed={user.isFollowed}
          edit={edit}
          setEdit={setEdit}
          cover={user.cover}
        />
      </section>
      {!profileEdit && (
        <>
          <ToggleGroup
            items={[
              { key: "1", label: "Posts" },
              { key: "2", label: "Friends" },
              { key: "3", label: "Photos" },
            ]}
            className="z-[2] mb-3 relative"
            onChange={handleTabChange}
          />
          {activeTab === "1" && <Posts user={user} postFilter={filter} />}
          {activeTab === "2" && (
            <>
              {friends.length > 0 &&
                friends.map((friend: any) => (
                  <FriendCard key={friend.id} user={friend} />
                ))}
              {friends.length === 0 && (
                <Box sx={{ textAlign: "center", py: 10, color: "gray.500" }}>
                  <Typography variant="body1">No friends found</Typography>
                </Box>
              )}
            </>
          )}
          {activeTab === "3" && (
            <>
              <Images
                data={slides}
                onClick={(currentIndex: any) => setIndex(currentIndex)}
              />
              <Lightbox
                plugins={[Captions, Fullscreen, Zoom, Thumbnails]}
                captions={{
                  showToggle: true,
                  descriptionTextAlign: "end",
                }}
                index={index}
                open={index >= 0}
                close={() => setIndex(-1)}
                slides={slides}
              />
            </>
          )}
        </>
      )}
      {profileEdit && <EditProfile profile={currentUser} />}
    </>
  );
};
