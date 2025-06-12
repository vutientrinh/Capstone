import { IMGAES_URL } from "@/global-config";
import { profileStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { Avatar } from "@mui/material";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
export const FriendRequest = ({ user }: { user: any }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const acceptFriendRequest = async () => {
    const requestId = user?.requestId;
    await backendClient.acceptFriendRequest(requestId);
    dispatch(profileStore.actions.acceptFriendRequest({ id: requestId }));
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
          {/* Accept Button */}
          <button
            className="flex items-center justify-center w-12 h-12 text-green-500 rounded-full transition-all duration-300 ease-in-out cursor-pointer hover:bg-[rgba(0,0,0,0.06)] hover:backdrop-blur-md active:bg-[rgba(0,0,0,0.12)]"
            onClick={acceptFriendRequest}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7"
            >
              <path
                fillRule="evenodd"
                d="M9 16.17l-4.88-4.88a1 1 0 1 1 1.41-1.41l3.47 3.47 7.79-7.79a1 1 0 0 1 1.41 1.41l-9.2 9.2a1 1 0 0 1-1.41 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Reject Button */}
          <button className="flex items-center justify-center w-12 h-12 text-red-500 rounded-full transition-all duration-300 ease-in-out cursor-pointer hover:bg-[rgba(0,0,0,0.06)] hover:backdrop-blur-md active:bg-[rgba(0,0,0,0.12)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7"
            >
              <path
                fillRule="evenodd"
                d="M6.225 6.225a1 1 0 0 1 1.415 0L12 10.586l4.36-4.36a1 1 0 1 1 1.415 1.415L13.414 12l4.36 4.36a1 1 0 1 1-1.415 1.415L12 13.414l-4.36 4.36a1 1 0 1 1-1.415-1.415L10.586 12l-4.36-4.36a1 1 0 0 1 0-1.415z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
