import { IMGAES_URL } from "@/global-config";
import { profileStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
export const FriendSuggested = ({ user }: { user: any }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isHoveringAdd, setIsHoveringAdd] = useState(false);
  const currentUser = useSelector(profileStore.selectCurrentUser);
  const handleCreateRequest = async () => {
    const receiverId = user?.id;
    const requesterId = currentUser?.id;
    const payload = {
      receiverId,
      requesterId,
    };
    await backendClient.createRequest(payload);
    dispatch(profileStore.actions.addFriend(receiverId));
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
          <button
            className="flex items-center gap-1 px-3 py-2 text-green-500 bg-[var(--background)] border border-gray-300 dark:border-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-400 transition-colors duration-200 text-sm"
            onClick={handleCreateRequest}
            onMouseEnter={() => setIsHoveringAdd(true)}
            onMouseLeave={() => setIsHoveringAdd(false)}
            aria-label="Thêm bạn bè"
          >
            <UserPlus
              size={16}
              className={isHoveringAdd ? "text-green-600" : "text-green-500"}
            />
            <span className="hidden sm:inline">Kết bạn</span>
          </button>
        </div>
      </div>
    </div>
  );
};
