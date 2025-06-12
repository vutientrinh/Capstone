"use client";

import { ChatContainer } from "@/components/chat-container";
import { NoChatSelected } from "@/components/no-chat-selected/page";
import { chatStore } from "@/store/reducers";
import { getPageTitle } from "@/utils/pathNameUtils";
import { usePathname, useRouter } from "next/navigation";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";

export default function MessagesTestPage() {
  const pathname = usePathname();
  const selectedUser = useSelector(chatStore.selectSelectedUser);

  return (
    <>
      <Helmet>
        <title>{getPageTitle(pathname)} | satchat</title>
      </Helmet>
      <div className="h-screen bg-base-200">
        <div className="flex items-center justify-center pt-20 px-4">
          <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
            <div className="flex h-full rounded-lg overflow-hidden">
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
