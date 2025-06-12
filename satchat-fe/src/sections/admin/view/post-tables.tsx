import { IMGAES_URL } from "@/global-config";
import backendClient from "@/utils/BackendClient";
import { Pagination } from "@mui/material";
import { Bot } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const PostTables = () => {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState<any | null>({});
  const [page, setPage] = useState<number>(1);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<{
    violated: boolean;
    reason?: string;
  } | null>({
    violated: false,
    reason: "Nội dung không vi phạm",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpenModal = (content: string) => {
    setModalOpen(true);
    setLoading(true);
    analyzeContent(content);
  };

  const analyzeContent = async (content: string) => {
    const reponse: any = await backendClient.checkPolicies(content);
    if (!reponse.data) {
      return;
    }
    setAnalysisResult({
      violated: reponse.data.violated,
      reason: reponse.data.reason,
    });
    setLoading(false);
  };

  const handleChangeStatus = async (postId: string, status: string) => {
    try {
      const response: any = await backendClient.changeStatusPost(
        postId,
        status
      );
      const result = response.data;
      if (result) {
        setPosts((prevPosts: any) => ({
          ...prevPosts,
          data: prevPosts.data.map((post: any) =>
            post.id === postId ? result.data : post
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response: any = await backendClient.getPostsPerPage(page);
      if (!response) {
        return;
      }
      const result = response.data.data;
      setPosts(result);
    };

    fetchPosts();
  }, [page]);

  const truncateContent = (content: any, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const shortenId = (id: any) => {
    return id ? id.substring(0, 8) + "..." : "";
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  function HighlightedReason({ reason }: { reason: string }) {
    const parts = reason.split(/(\$.*?\$)/g);

    return (
      <p>
        {parts.map((part, index) => {
          if (part.startsWith("$") && part.endsWith("$")) {
            const word = part.slice(1, -1);
            return (
              <span key={index} style={{ color: "red", fontWeight: "bold" }}>
                {word}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </p>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý bài viết</h1>
        <div className="flex items-center">
          <span className="mr-2 text-gray-600">
            Tổng số: {posts.totalElements} bài viết
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tác giả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nội dung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình ảnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chủ đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tương tác
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts?.data?.map((post: any) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={IMGAES_URL + post.author.avatar}
                          alt={`${post.author.firstName} ${post.author.lastName}`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {post.author.firstName} {post.author.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{post.author.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs break-words">
                      {truncateContent(post.content)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ID: {shortenId(post.id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {post.images.length > 0 ? (
                        <>
                          <img
                            src={IMGAES_URL + post.images[0]}
                            alt="Post image"
                            className="h-8 w-8 rounded object-cover"
                          />
                          {post.images.length > 1 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              +{post.images.length - 1}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Không có ảnh
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: post.topic.color }}
                    >
                      {post.topic.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <svg
                          className="h-4 w-4 text-red-500 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {post.likedCount}
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="h-4 w-4 text-blue-500 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {post.commentCount}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold
                        ${
                          post.postStatus === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }                        
                        ${
                          post.postStatus === "DELETED"
                            ? "bg-red-100 text-red-800"
                            : ""
                        }
                      `}
                    >
                      <select
                        value={post.postStatus}
                        onChange={(e) => {
                          handleChangeStatus(post.id, e.target.value);
                        }}
                        className="bg-transparent outline-none text-xs"
                      >
                        <option value="APPROVED">Đã duyệt</option>
                        <option value="DELETED">Đã xóa</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        handleOpenModal(post.content);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Bot className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="w-full flex justify-center sm:justify-end mt-4 overflow-x-auto">
        <Pagination
          count={posts.totalPages || 1}
          page={posts.currentPage || 1}
          onChange={(_, value) => setPage(value)}
          siblingCount={1}
          boundaryCount={1}
          variant="outlined"
          shape="rounded"
        />
      </div>

      {modalOpen && loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {modalOpen && analysisResult && !loading && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div
              className="fixed inset-0 bg-black opacity-50"
              aria-hidden="true"
            />

            <div className="inline-block bg-white rounded-lg p-6 text-left shadow-xl transform transition-all sm:align-middle max-w-md w-full z-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Phân tích nội dung
              </h3>

              <div className="mb-4">
                <p
                  className={`font-semibold ${
                    analysisResult.violated ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {analysisResult.violated
                    ? "Nội dung VI PHẠM chính sách"
                    : "Nội dung KHÔNG vi phạm"}
                </p>

                {analysisResult.violated && analysisResult.reason && (
                  <p className="mt-2 text-sm text-gray-600">
                    Lý do:
                    <HighlightedReason reason={analysisResult.reason} />
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
