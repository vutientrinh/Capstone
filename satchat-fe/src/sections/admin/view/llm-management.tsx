import { useEffect, useRef, useState } from "react";
import {
  Search,
  Info,
  MessageSquare,
  Package,
  FileText,
  Send,
  ChevronDown,
} from "lucide-react";
import socketClient from "@/socket/SocketClient";
import backendClient from "@/utils/BackendClient";
import { IMGAES_URL, SOCKET_URL } from "@/global-config";
import { endpoints } from "@/utils/endpoints";
import { getCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import { adminStore, profileStore } from "@/store/reducers";

export const LLMManagement = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any>([]);
  const [messageInput, setMessageInput] = useState<any>("");

  const [friendList, setFriendList] = useState<any[]>([]);
  const currentUser = useSelector(profileStore.selectCurrentUser);
  const recPosts = useSelector(adminStore.selectPostRec);
  const paginationPost = useSelector(adminStore.selectPostRecPagination);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<any>(null);

  useEffect(() => {
    dispatch(profileStore.getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedUser?.user.id) return;
    const pageNum = paginationPost.currentPage;
    dispatch(adminStore.getRecPostById(pageNum, selectedUser.user.id));
  }, [selectedUser?.user.id, paginationPost.currentPage]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!currentUser?.id) return;
    let data = [] as any;
    const loadFriends = async () => {
      data = await backendClient.getFriends();
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
            if (messageBody.messageType === "FRIEND_OFFLINE") {
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
            }
          },
          forMessageTypes: ["FRIEND_ONLINE", "FRIEND_OFFLINE"],
        },
      ]
    );
  }, [socketClient, currentUser?.id]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: "admin",
      text: messageInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setIsLoading(true);
    setChatMessages([...chatMessages, newMessage]);

    // Simulate assistant response
    setTimeout(async () => {
      try {
        const response: any = await backendClient.ask(
          selectedUser.user.id,
          messageInput
        );
        console.log("response", response.data);

        const assistantResponse = {
          id: chatMessages.length + 2,
          sender: "assistant",
          text: response.data,
          timestamp: new Date().toLocaleTimeString(),
        };

        setChatMessages((prev: any) => [...prev, assistantResponse]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching assistant response:", error);
        setIsLoading(false);
        const errorMessage = {
          id: chatMessages.length + 2,
          sender: "assistant",
          text: "Đã xảy ra lỗi khi lấy phản hồi từ trợ lý. Vui lòng thử lại sau.",
          timestamp: new Date().toLocaleTimeString(),
        };
        setChatMessages((prev: any) => [...prev, errorMessage]);
      }
    }, 500);

    setMessageInput("");
  };

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    // Reset chat messages when selecting new user
    setChatMessages([
      {
        id: 1,
        sender: "system",
        text: `Bạn đang xem thông tin và recommendations của người dùng ${user.user.firstName} ${user.user.lastName}.`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center my-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left sidebar - User list */}
      <div className="w-1/4 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {friendList.map((user) => (
            <div
              key={user.user.id}
              className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedUser?.user.id === user.user.id ? "bg-blue-50" : ""
              }`}
              onClick={() => handleUserSelect(user)}
            >
              <div className="relative">
                <img
                  src={IMGAES_URL + user.user.avatar}
                  alt={user.user.firstName + " " + user.user.lastName}
                  className="w-10 h-10 rounded-full"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    user.isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">
                    {user.user.firstName} {user.user.lastName}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {user.isOnline ? "Đang hoạt động" : "Không hoạt động"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Selected user info */}
            <div className="bg-white p-4 border-b border-gray-200 flex items-center">
              <img
                src={IMGAES_URL + selectedUser?.user.avatar}
                alt={
                  selectedUser?.user.firstName +
                  " " +
                  selectedUser?.user.lastName
                }
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <h2 className="font-semibold text-lg">
                  {selectedUser?.user.firstName} {selectedUser?.user.lastName}
                </h2>
              </div>
              <button className="ml-auto text-blue-600 flex items-center">
                <Info size={18} className="mr-1" /> Xem chi tiết
              </button>
            </div>

            {/* Recommendations section */}
            <div className="bg-white shadow-sm">
              <div className="flex border-b border-gray-200">
                <button
                  className={`px-4 py-3 font-medium text-sm flex items-center ${
                    activeTab === "posts"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab("posts")}
                >
                  <FileText size={18} className="mr-2" /> Post Recommendations
                </button>
              </div>

              <div className="p-4">
                <div className="flex justify-between mb-3">
                  <h3 className="font-medium">
                    {activeTab === "products"
                      ? "Sản phẩm gợi ý"
                      : "Bài viết gợi ý"}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Sắp xếp theo: Điểm số cao nhất</span>
                    <ChevronDown size={16} className="ml-1" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left font-medium text-gray-600">
                          Nội dung
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">
                          Chủ đề
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">
                          Tác giả
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recPosts.map((post: any) => (
                        <tr
                          key={post.id}
                          className="border-t border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {post.content.length > 50
                              ? post.content.substring(0, 50) + "..."
                              : post.content}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {post.topic?.name || "Không có chủ đề"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {post.author?.firstName} {post.author?.lastName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* )} */}
                </div>
              </div>
            </div>

            {/* Chat section */}
            <div className="flex-1 bg-gray-50 flex flex-col">
              <div className="p-3 border-b border-gray-200 bg-white">
                <h3 className="text-sm font-medium flex items-center">
                  <MessageSquare size={16} className="mr-2 text-blue-600" />
                  Chatbot assistant cho admin
                </h3>
                <p className="text-xs text-gray-500">
                  Hỏi đáp thông tin chi tiết về người dùng{" "}
                  {selectedUser?.user.firstName} {selectedUser?.user.lastName}{" "}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {chatMessages.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`mb-4 flex ${
                      msg.sender === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "system" && (
                      <div className="bg-gray-200 rounded-lg py-2 px-4 max-w-3/4 text-sm text-gray-700">
                        {msg.text}
                      </div>
                    )}

                    {msg.sender === "assistant" && (
                      <div className="flex">
                        <div className="bg-blue-100 rounded-lg py-2 px-4 max-w-3/4 text-sm">
                          <p className="whitespace-pre-line">{msg.text}</p>
                          <span className="text-xs text-gray-500 mt-1 block">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    )}

                    {msg.sender === "admin" && (
                      <div className="bg-blue-600 rounded-lg py-2 px-4 max-w-3/4 text-sm text-white">
                        <p>{msg.text}</p>
                        <span className="text-xs text-blue-200 mt-1 block">
                          {msg.timestamp}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && <LoadingSpinner />}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 bg-white border-t border-gray-200">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Nhập câu hỏi về người dùng này..."
                    className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white rounded-r-lg px-4 py-2 hover:bg-blue-700 focus:outline-none flex items-center"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Gợi ý: "Hãy phân tích hành vi mua sắm của người dùng này" hoặc
                  "Đề xuất sản phẩm mới cho họ"
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <div className="bg-blue-100 p-6 rounded-full inline-flex items-center justify-center mb-4">
                <MessageSquare size={32} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-medium text-gray-800 mb-2">
                Chưa chọn người dùng
              </h2>
              <p className="text-gray-500 max-w-md">
                Vui lòng chọn một người dùng từ danh sách bên trái để xem các
                gợi ý sản phẩm, bài viết và tương tác với chatbot hỗ trợ.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LLMManagement;
