import React, { useState, useEffect, useContext } from "react";
import Button from "./Button";
import ChatView from "./ChatView";
import backendClient from "../utils/BackendClient";
import SocketClientContext from "../context/SocketClientContext";
import UserContext from "../context/UserContext";

const FriendView = () => {
  const [friendList, setFriendList] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const { id: userId } = useContext(UserContext);
  const { socketClient } = useContext(SocketClientContext);
  const [deliveryStatuses, setDeliveryStatuses] = useState([]);

  const handleSelectedFriend = (friend) => {
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
    let data = [];
    const loadFriends = async () => {
      data = await backendClient.getFriends();
      const apiResponse = await backendClient.getUnseenMessages();
      console.log("apiResponse: ", apiResponse);
      if (apiResponse && apiResponse.length > 0) {
        apiResponse.forEach((r) => {
          for (let d of data) {
            if (d.connectionId === r.fromUser) {
              d.unSeen = r.count;
            }
          }
        });
      }

      setFriendList(data);
    };

    loadFriends();

    let subscriptions = [];

    subscriptions.push(
      socketClient.subscribe(
        `/topic/${userId}`,

        (message) => {
          const messageBody = JSON.parse(message.body);
          // console.log("from user id");
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
        "CHAT",
        "UNSEEN",
        "FRIEND_ONLINE",
        "FRIEND_OFFLINE",
        "MESSAGE_DELIVERY_UPDATE"
      ),
      socketClient.subscribe(
        `/topic/notifications`,
        (message) => {
          const messageBody = JSON.parse(message.body);

          if (messageBody.messageType === "LIKE_COUNT") {
            console.log("LIKE_COUNT");
            console.log("messageBody: ", messageBody);
          }
          if (messageBody.messageType === "FOLLOW_COUNT") {
            console.log("FOLLOW_COUNT");
            console.log("messageBody: ", messageBody);
          }
          if (messageBody.messageType === "POST_COUNT") {
            console.log("POST_COUNT");
            console.log("messageBody: ", messageBody);
          }
          if (messageBody.messageType === "COMMENT_POST_COUNT") {
            console.log("COMMENT_POST_COUNT");
            console.log("messageBody: ", messageBody);
          }
          if (messageBody.messageType === "COMMENT_LIKED_COUNT") {
            console.log("COMMENT_LIKED_COUNT");
            console.log("messageBody: ", messageBody);
          }
        },
        "LIKE_COUNT",
        "FOLLOW_COUNT",
        "POST_COUNT",
        "COMMENT_POST_COUNT",
        "COMMENT_LIKED_COUNT"
      ),
      socketClient.subscribe(
        `/topic/notifications/${userId}`,
        (message) => {
          const messageBody = JSON.parse(message.body);

          if (messageBody.messageType === "LIKE_POST") {
            console.log("LIKE_POST");
            console.log("messageBody: ", messageBody);
          }
          if (messageBody.messageType === "FOLLOW_USER") {
            console.log("FOLLOW_USER");
            console.log("messageBody: ", messageBody);
          }
          if (messageBody.messageType === "COMMENT_POST") {
            console.log("COMMENT_POST");
            console.log("messageBody: ", messageBody);
          }
          if (messageBody.messageType === "COMMENT_LIKED") {
            console.log("COMMENT_LIKED");
            console.log("messageBody: ", messageBody);
          }
          if (messageBody.messageType === "FRIEND_REQUEST") {
            console.log("FRIEND_REQUEST");
            console.log("messageBody: ", messageBody);
          }
          if (messageBody.messageType === "FRIEND_REQUEST_ACCEPTED") {
            console.log("FRIEND_REQUEST_ACCEPTED");
            console.log("messageBody: ", messageBody);
          }
        },
        "LIKE_POST",
        "FOLLOW_USER",
        "COMMENT_POST",
        "COMMENT_LIKED",
        "FRIEND_REQUEST",
        "FRIEND_REQUEST_ACCEPTED"
      )
    );

    return () => {
      if (subscriptions) {
        subscriptions.forEach((s) => s.unsubscribe());
      }
    };
  }, [socketClient, userId]);

  return (
    <div>
      {friendList.length > 0 &&
        friendList.map((friend, idx) => {
          let count =
            friend.unSeen && friend.unSeen > 0 ? `(${friend.unSeen})` : "";
          let onlineStatusText = friend.isOnline ? "(online)" : "";
          let displayText = `${onlineStatusText} Chat with ${friend.connectionUsername} ${count}`;
          return (
            <div key={idx}>
              <Button
                onClick={() => {
                  handleSelectedFriend(friend);
                }}
                displayText={displayText}
              />
            </div>
          );
        })}
      {selectedFriend && (
        <div>
          <br />
          <ChatView
            friend={selectedFriend}
            deliveryStatuses={deliveryStatuses}
          ></ChatView>
        </div>
      )}
    </div>
  );
};

export default FriendView;
