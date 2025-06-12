interface Topic {
  id: string;
  name: string;
  postCount: number;
  color: string;
}

interface Author {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

interface Post {
  id: string;
  content: string;
  images: string[];
  authorId: string;
  topicId: string;
  commentCount: number;
  likedCount: number;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  topic: Topic;
  author: Author;
  hasLiked: boolean;
  hasSaved: boolean;
}

interface IPostsResponse {
  data: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    data: Post[];
  };
}
