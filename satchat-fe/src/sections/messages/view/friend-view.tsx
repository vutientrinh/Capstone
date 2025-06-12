"use client";

import React, { useContext, useState, useEffect } from "react";
import "../styles.css";
import UserContext from "@/context/UserContext";
import backendClient from "@/utils/BackendClient";
import { Button } from "./button";
import { ChatView } from "./chat-view";
import { Box, Typography } from "@mui/material";
import { NoChatSelected } from "@/components/no-chat-selected/page";
import socketClient from "@/socket/SocketClient";
import { endpoints } from "@/utils/endpoints";
import { IMGAES_URL, SOCKET_URL } from "@/global-config";
import { getCookie } from "cookies-next";
import { useSelector } from "react-redux";
import { profileStore } from "@/store/reducers";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FriendView = () => {
  const { t } = useTranslation();
  const [friendList, setFriendList] = useState<any[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const currentUser = useSelector(profileStore.selectCurrentUser);
  //const { id: userId } = useContext(UserContext) as { id: string };
  const [deliveryStatuses, setDeliveryStatuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSelectedFriend = (friend: any) => {
    setSelectedFriend(friend);
    setFriendList((prev) => {
      for (let d of prev) {
        if (d.connectionId === friend.connectionId) {
          d.unSeen = 0;
        }
      }
      return [...prev];
    });
  };

  useEffect(() => {
    if (!currentUser?.id) return;
    let data = [] as any;
    const loadFriends = async () => {
      data = await backendClient.getFriends();
      const apiResponse = (await backendClient.getUnseenMessages()) as any;
      console.log("unseen messages: ", apiResponse);
      if (apiResponse && apiResponse.length > 0) {
        apiResponse.forEach((r: any) => {
          for (let d of data) {
            if (d.connectionId === r.fromUser) {
              d.unSeen = r.count;
            }
          }
        });
      }

      setFriendList(data.data);
    };

    loadFriends();

    socketClient.connect(
      SOCKET_URL + endpoints.webSocketUrl,
      getCookie("token") as string,
      [
        {
          topic: `/topic/${currentUser?.id}`,
          callback: (message: any) => {
            const messageBody = JSON.parse(message.body);
            console.log("friendView: ", messageBody);
            if (
              messageBody.messageType === "CHAT" ||
              messageBody.messageType === "UNSEEN"
            ) {
              const { senderId } = messageBody;
              setFriendList((prev) => {
                for (let d of prev) {
                  if (d.connectionId === senderId) {
                    d.unSeen += 1;
                  }
                }
                return [...prev];
              });
            } else if (messageBody.messageType === "FRIEND_OFFLINE") {
              // do offline shit
              setFriendList((prev) => {
                for (let d of prev) {
                  if (
                    d.connectionId === messageBody.userConnection.connectionId
                  ) {
                    d.isOnline = false;
                    break;
                  }
                }
                return [...prev];
              });
            } else if (messageBody.messageType === "FRIEND_ONLINE") {
              setFriendList((prev) => {
                for (let d of prev) {
                  if (
                    d.connectionId === messageBody.userConnection.connectionId
                  ) {
                    d.isOnline = true;
                    break;
                  }
                }
                return [...prev];
              });
            } else if (messageBody.messageType === "MESSAGE_DELIVERY_UPDATE") {
              setDeliveryStatuses(messageBody.messageDeliveryStatusUpdates);
            }
          },
          forMessageTypes: [
            "CHAT",
            "UNSEEN",
            "FRIEND_ONLINE",
            "FRIEND_OFFLINE",
            "MESSAGE_DELIVERY_UPDATE",
          ],
        },
      ]
    );
  }, [socketClient, currentUser?.id]);

  return (
    <Box
      sx={{ display: "flex", width: "100%", height: "100vh" }}
      className="bg-[var(--background)] border border-gray-300 mt-10 mx-10 mb-0"
    >
      <Box
        className="overflow-y-scroll scrollbar-hide"
        sx={{
          flexShrink: 0,
          borderRight: "1px solid",
          borderColor: "divider",
          position: { xs: "static", md: "sticky" },
          top: 0,
          height: "100vh",
          width: { xs: "100%", md: 300, lg: 350, xl: 400 },
          display: { xs: "none", md: "block" },
        }}
      >
        <div className="p-4 bg-[var(--background)] flex items-center justify-between">
          <div className="relative w-full border border-gray-300">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t("conv.search")}
              className="w-full py-2 pl-10 pr-3 bg-[var(--background)] rounded border-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {friendList.length > 0 &&
          friendList.map((friend: any, idx: any) => {
            return (
              <div key={idx} className="hover:cursor-pointer">
                <Box sx={{ m: 1 }}>
                  <Button
                    onClick={() => {
                      handleSelectedFriend(friend);
                    }}
                    displayText={
                      friend.user.firstName + " " + friend.user.lastName
                    }
                    isOnline={friend.isOnline}
                    countUnSeen={friend.unSeen}
                    avatarUrl={IMGAES_URL + friend.user.avatar}
                  />
                </Box>
              </div>
            );
          })}
      </Box>
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        {selectedFriend ? (
          <ChatView
            isOnline={selectedFriend.isOnline}
            avatar={IMGAES_URL + selectedFriend.user.avatar}
            friend={selectedFriend}
            deliveryStatuses={deliveryStatuses}
          />
        ) : (
          <NoChatSelected />
        )}
      </Box>
    </Box>
  );
};
