import { IMGAES_URL } from "@/global-config";
import { profileStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { MessageSquare } from "lucide-react";
import { UserMinus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
export const FriendCard = ({ user }: { user: any }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isHovering, setIsHovering] = useState(false);
  const handleRemoveFriend = async () => {
    const userId = user?.id;
    await backendClient.removeFriend(userId);
    dispatch(profileStore.actions.removeFriend(userId));
  };
  return (
    <div className="m-2">
      <div className="flex items-center justify-between p-4 rounded-lg shadow-md mb-4 bg-[var(--background-component)]">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
            <img
              className="w-full h-full object-cover"
              src={IMGAES_URL + user.avatar}
              alt={`Avatar của ${user.firstName} ${user.lastName}`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("friends.joinOn")}{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Message Button */}
          <button
            className="flex items-center gap-1 px-3 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm"
            onClick={() => {}}
            aria-label="Gửi tin nhắn"
          >
            <MessageSquare size={16} />
            <span className="hidden sm:inline">Nhắn tin</span>
          </button>

          {/* Improved Remove Button */}
          <button
            className="flex items-center gap-1 px-3 py-2 text-red-500 bg-[var(--background)] border border-gray-300 dark:border-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-400 transition-colors duration-200 text-sm"
            onClick={handleRemoveFriend}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            aria-label="Xóa bạn bè"
          >
            <UserMinus
              size={16}
              className={isHovering ? "text-red-600" : "text-red-500"}
            />
            <span className="hidden sm:inline">Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
