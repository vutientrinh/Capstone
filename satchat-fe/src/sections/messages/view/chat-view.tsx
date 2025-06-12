"use client";

import React, { useContext, useState, useEffect, useRef } from "react";
import "../styles.css";
import backendClient from "@/utils/BackendClient";
import { TextInput } from "./text-input";
import UserContext from "@/context/UserContext";
import socketClient from "@/socket/SocketClient";
import { getCookie } from "cookies-next";
import { IMGAES_URL, SOCKET_URL } from "@/global-config";
import { endpoints } from "@/utils/endpoints";
import { convStore, profileStore } from "@/store/reducers";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Circle, Paperclip, Send, SendIcon, SmilePlus } from "lucide-react";
import { BsCircle, BsCheckCircle, BsEye } from "react-icons/bs";
import { useTranslation } from "react-i18next";

export const ChatView = ({
  isOnline,
  avatar,
  friend,
  deliveryStatuses,
}: any) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { connectionId, connectionUsername, convId, user } = friend;
  const currentUser = useSelector(profileStore.selectCurrentUser);
  //const { id: userId } = useContext(UserContext) as { id: string };
  const [messages, setMessages] = useState({}) as any;
  const [userMessage, setUserMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // load old messages
  const [oldestMessageId, setOldestMessageId] = useState<string | null>(null);

  useEffect(() => {
    const initializeMessages = async () => {
      try {
        dispatch(convStore.actions.setLoading(true));
        const response = await backendClient.getMessageBefore(null, convId, 1);

        if (
          response &&
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          const { data, currentPage, totalPages } = response.data;

          setOldestMessageId(data[0].id);
          setMessages((prev: any) => ({
            ...prev,
            [connectionId]: data,
          }));

          dispatch(
            convStore.actions.setMessages({
              messages: data,
              currentPage,
              totalPages,
            })
          );
        } else {
          setMessages((prev: any) => ({
            ...prev,
            [connectionId]: [],
          }));

          dispatch(
            convStore.actions.setMessages({
              messages: [],
              currentPage: 1,
              totalPages: 1,
            })
          );
        }
      } catch (error) {
        console.error("Error loading initial messages:", error);
      } finally {
        dispatch(convStore.actions.setLoading(false));
      }
    };

    initializeMessages();
  }, [convId, connectionId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[connectionId]]);

  if (deliveryStatuses && deliveryStatuses.length > 0) {
    console.dir(deliveryStatuses);
    const keys = Object.keys(messages);
    let fullRefreshObj: Record<string, any> | null = null;
    let statusUpdated = false;
    if (keys) {
      fullRefreshObj = {};
      for (const key of keys) {
        fullRefreshObj[key] = [];
        const messagesOfThisUser = messages[key];
        for (const message of messagesOfThisUser) {
          for (const socketMessageUpdate of deliveryStatuses) {
            if (message.id === socketMessageUpdate.id) {
              if (
                message.messageDeliveryStatusEnum !==
                socketMessageUpdate.messageDeliveryStatusEnum
              ) {
                message.messageDeliveryStatusEnum =
                  socketMessageUpdate.messageDeliveryStatusEnum;

                statusUpdated = true;
              }
            }
          }
          fullRefreshObj[key].push(message);
        }
      }
    }

    if (statusUpdated && fullRefreshObj) {
      setMessages(fullRefreshObj);
    } else {
      console.log("poora loop maara but nothing to update");
    }
  }

  useEffect(() => {
    socketClient.connect(
      SOCKET_URL + endpoints.webSocketUrl,
      getCookie("token") as string,
      [
        {
          topic: `/topic/${convId}`,
          callback: (message: any) => {
            const messageBody = JSON.parse(message.body);
            console.log("chatView: ", messageBody);
            if (
              messageBody.messageType === "CHAT" ||
              messageBody.messageType === "UNSEEN"
            ) {
              setMessages((prev: any) => {
                const friendsMessages = prev[connectionId] || [];
                const newMessages = [...friendsMessages, messageBody];
                const newObj = { ...prev, [connectionId]: newMessages };
                return newObj;
              });
            }
          },
          forMessageTypes: ["CHAT", "UNSEEN"],
        },
      ]
    );

    const getUnseenMessages = async () => {
      const apiResponse = (await backendClient.getUnseenMessages(
        connectionId
      )) as any;
      setMessages((prev: any) => {
        const friendsMessages = prev[connectionId] || [];

        const newMessages = [...friendsMessages, ...apiResponse.data];
        const newObj = { ...prev, [connectionId]: newMessages };
        return newObj;
      });
      backendClient.setReadMessages(apiResponse.data);
    };

    getUnseenMessages();
  }, [connectionId, socketClient, convId]);

  const onInputChange = (e: any) => {
    setUserMessage(e.target.value);
  };

  const sendUserMessage = (message: any) => {
    socketClient?.publish({
      destination: `/app/chat/sendMessage/${convId}`,
      body: {
        messageType: "CHAT",
        content: message,
        receiverId: connectionId,
        receiverUsername: connectionUsername,
      },
    });
    setUserMessage("");
  };

  const MessageStatus = ({ status }: { status: string }) => {
    return (
      <div className="message-status">
        {status.toLowerCase() === "seen" && (
          <BsEye style={{ color: "#4fc3f7", fontSize: 16 }} />
        )}
        {status.toLowerCase() === "delivered" && (
          <BsCheckCircle style={{ color: "gray", fontSize: 16 }} />
        )}
        {status.toLowerCase() === "not_delivered" && (
          <BsCircle style={{ color: "gray", fontSize: 16 }} />
        )}
      </div>
    );
  };

  return (
    <div>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          p: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <div className="relative mr-3">
          <img
            src={IMGAES_URL + user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>

        <div className="flex-grow">
          <div className="font-semibold text-lg text-[var(--foreground)]">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-xs text-gray-500 flex items-center">
            {isOnline ? (
              <div className="flex items-center">
                <Circle size={8} className="text-green-500 fill-current mr-1" />
                Online
              </div>
            ) : (
              <div className="text-md text-gray-400">Offline</div>
            )}
          </div>
        </div>
      </Stack>
      <Box
        sx={{
          height: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            p: 2,
          }}
        >
          {messages[connectionId] &&
            messages[connectionId].length > 0 &&
            messages[connectionId].map((message: any, idx: any) => {
              if (message.messageType === "CHAT") {
                if (message.senderId === currentUser?.id) {
                  return (
                    <div key={idx} className="message sent">
                      <div className="message-bubble">{message.content}</div>
                      <div className="message-footer">
                        <div className="message-time">
                          {new Date(message.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="message-status">
                          {message.messageDeliveryStatusEnum && (
                            <MessageStatus
                              status={message.messageDeliveryStatusEnum.toLowerCase()}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={idx} className="message received">
                      <div className="message-username">
                        {message.senderUsername}
                      </div>
                      <div className="message-bubble">{message.content}</div>
                      <div className="message-footer">
                        <div className="message-time">
                          {new Date(message.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }
              } else {
                return (
                  <div key={idx} className="message received">
                    <div className="message-username">
                      {message.senderUsername}{" "}
                      <span className="message-tag">(new)</span>
                    </div>
                    <div className="message-bubble">{message.content}</div>
                    <div className="message-footer">
                      <div className="message-time">
                        {new Date(message.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input at bottom */}
        <Box
          className="p-3 border-t bg-[var(--background)] flex items-center"
          sx={{ borderTop: "1px solid", borderColor: "divider" }}
        >
          <button className="p-2 rounded-full hover:bg-gray-100 mr-2">
            <Paperclip size={20} className="text-gray-500" />
          </button>

          <div className="relative flex-grow">
            <input
              type="text"
              placeholder={t("conv.typeMessage")}
              className="w-full py-2 px-4 bg-[var(--background-component)] rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={userMessage}
              onChange={onInputChange}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendUserMessage(userMessage);
                }
              }}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200">
              <SmilePlus size={20} className="text-gray-500" />
            </button>
          </div>

          <button
            onClick={() => sendUserMessage(userMessage)}
            disabled={!userMessage.trim()}
            className={`ml-2 p-3 rounded-full ${
              userMessage.trim()
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send size={18} />
          </button>
        </Box>
      </Box>
    </div>
  );
};
