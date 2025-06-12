import { commonStore, postStore } from "@/store/reducers";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Search } from "lucide-react";
import { Dialog, DialogContent } from "@mui/material";
import { Heart, MessageCircle } from "lucide-react";
import backendClient from "@/utils/BackendClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IMGAES_URL } from "@/global-config";

export const SearchDialog = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const display = useSelector(commonStore.selectSearchBar);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<any[]>([]);

  const handleClose = () => {
    dispatch(commonStore.actions.setSearchBar(false));
    setSearchQuery("");
  };

  useEffect(() => {
    const loadPosts = async () => {
      if (searchQuery) {
        try {
          const encodedQuery = encodeURIComponent(searchQuery);
          const response: any = await backendClient.search(encodedQuery);
          const result = response.data;
          console.log("Search results:", result);
          setPosts(result.data);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }
    };

    loadPosts();
  }, [searchQuery]);

  const handleClick = (postId: any) => {
    dispatch(postStore.actions.setCurrentPostId(postId));
    setSearchQuery("");
    handleClose();
    router.push(`/post/${postId}`);
  };

  return (
    <Dialog open={display} onClose={handleClose}>
      <DialogContent className="w-[1000px] max-w-full">
        <div className="flex items-center mb-1">
          <div className="flex-grow flex items-center space-x-2">
            <Search className="text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full outline-none text-lg"
            />
          </div>
          <button
            onClick={handleClose}
            className="ml-2 text-gray-600 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>
        {searchQuery && (
          <div>
            {posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post: any) => (
                  <div
                    key={post.id}
                    onClick={() => handleClick(post?.id)}
                    className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer border-b border-gray-100"
                  >
                    <img
                      src={IMGAES_URL + post.author.avatar}
                      alt={post.author.username}
                      className="w-8 h-8 rounded-full mr-3 object-cover"
                    />
                    <div className="flex-grow overflow-hidden">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-sm truncate">
                          {post.author.firstName} {post.author.lastName}
                        </p>
                        <span
                          className="ml-2 px-1.5 py-0.5 rounded text-xs"
                          style={{ backgroundColor: post.topic.color + "20" }}
                        >
                          {post.topic.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {post.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                Không tìm thấy bài viết nào
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
