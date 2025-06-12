const getPosts = (page: number): Promise<IPostsResponse> => {
  const generateRandomPost = (index: number) => ({
    id: `post-${page}-${index}`,
    content: `This is sample post #${index} on page ${page}.`,
    images: ["https://example.com/sample-image.jpg"],
    authorId:
      Math.random() > 0.5
        ? "0a22c812-f19e-4848-8bc7-3fdb69ea5bec"
        : "dd01ecbe-f798-4fb5-a56a-184c4ba9e023",
    topicId: "6b308001-c009-4897-b0fa-bd8f7668adb9",
    commentCount: Math.floor(Math.random() * 10),
    likedCount: Math.floor(Math.random() * 20),
    type: "TEXT",
    status: "PUBLIC",
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
    ).toISOString(),
    updatedAt: new Date(
      Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
    ).toISOString(),
    topic: {
      id: "6b308001-c009-4897-b0fa-bd8f7668adb9",
      name: "topic 1",
      postCount: 0,
      color: "#000000",
    },
    author: {
      id:
        Math.random() > 0.5
          ? "0a22c812-f19e-4848-8bc7-3fdb69ea5bec"
          : "dd01ecbe-f798-4fb5-a56a-184c4ba9e023",
      username: Math.random() > 0.5 ? "Alice" : "Bob",
      firstName: Math.random() > 0.5 ? "Alice" : "Robert",
      lastName: Math.random() > 0.5 ? "Thompson" : "Doe",
      avatar: "https://example.com/avatar.jpg",
    },
    hasLiked: Math.random() > 0.5,
    hasSaved: Math.random() > 0.7,
  });

  const mockResponse: IPostsResponse = {
    data: {
      currentPage: page,
      totalPages: 3,
      pageSize: 10,
      totalElements: 30,
      data: Array.from({ length: 10 }, (_, i) => generateRandomPost(i + 1)),
    },
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockResponse);
    }, 800);
  });
};

const posts = [
  {
    id: "147d7a63-716a-4d89-b4b6-0b6c6b81a163",
    content: "Bài viết mới tinh nè!!",
    images: [
      "a22a247798ad455abf859a43ed596963.jpg",
      "90e30c2582354186bc3fb57e5f5f7475.jpg",
    ],
    authorId: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
    topicId: "b8e2c6c2-aab6-488e-bf00-a88f0c998bb3",
    commentCount: 0,
    likedCount: 0,
    type: "TEXT",
    status: "PUBLIC",
    createdAt: "2025-03-28T08:08:23.824756Z",
    updatedAt: "2025-03-28T08:37:39.767485Z",
    topic: {
      id: "b8e2c6c2-aab6-488e-bf00-a88f0c998bb3",
      name: "Health",
      postCount: 0,
      color: "#00FF00",
    },
    author: {
      id: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
      username: "Alice",
      firstName: "Alice",
      lastName: "Thompson",
      avatar:
        "http://localhost:8280/minio/download/commons/165d0e01be874bb8b65bcfdcddd1a74a.jpg",
    },
    hasLiked: false,
    hasSaved: false,
  },
  {
    id: "4d4e565c-c6fb-47b8-9bbd-96d9b581c5fc",
    content: "[Updated] Test lại update bài viết. ",
    images: [
      "210d55a6aadf4397bf8d1fc309bb8846.jpg",
      "11c86e9d44c94887a4e77ebf36a81c24.jpg",
    ],
    authorId: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
    topicId: "7b30a1cd-b808-4b2a-b7bf-770011b5ae8c",
    commentCount: 0,
    likedCount: 0,
    type: "TEXT",
    status: "PUBLIC",
    createdAt: "2025-03-28T07:17:12.801466Z",
    updatedAt: "2025-03-28T08:06:26.715129Z",
    topic: {
      id: "7b30a1cd-b808-4b2a-b7bf-770011b5ae8c",
      name: "Computer",
      postCount: 0,
      color: "#00008B",
    },
    author: {
      id: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
      username: "Alice",
      firstName: "Alice",
      lastName: "Thompson",
      avatar:
        "http://localhost:8280/minio/download/commons/165d0e01be874bb8b65bcfdcddd1a74a.jpg",
    },
    hasLiked: false,
    hasSaved: false,
  },
  {
    id: "05c3b3de-e46a-4f0d-90cd-faea14924c56",
    content: "Test lại new post.",
    images: [
      "0c0339b68b414070b724dae006fa0401.jpg",
      "ec583460a3e94ab6876506d71e26804d.jpg",
    ],
    authorId: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
    topicId: "6b308001-c009-4897-b0fa-bd8f7668adb9",
    commentCount: 0,
    likedCount: 0,
    type: "TEXT",
    status: "PUBLIC",
    createdAt: "2025-03-28T01:10:54.204963Z",
    updatedAt: "2025-03-28T08:07:55.394245Z",
    topic: {
      id: "6b308001-c009-4897-b0fa-bd8f7668adb9",
      name: "Technology",
      postCount: 0,
      color: "#FF0000",
    },
    author: {
      id: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
      username: "Alice",
      firstName: "Alice",
      lastName: "Thompson",
      avatar:
        "http://localhost:8280/minio/download/commons/165d0e01be874bb8b65bcfdcddd1a74a.jpg",
    },
    hasLiked: false,
    hasSaved: true,
  },
  {
    id: "19cb14f2-cf63-40e3-bc0d-60e405abb64f",
    content:
      "Bob test bài viết mới đây. \r\nThực trạng đáng buồn: Sang Campuchia bị lừa, giải cứu đưa về nước lần 1. Tiếp tục sang lại bị lừa, giải cứu lần 2...",
    images: [
      "4a14048e9dcd47baaab049799a43da3f.jpg",
      "291a945c3eab4300926f77e1b4958e88.jpg",
    ],
    authorId: "dd01ecbe-f798-4fb5-a56a-184c4ba9e023",
    topicId: "6b308001-c009-4897-b0fa-bd8f7668adb9",
    commentCount: 0,
    likedCount: 1,
    type: "TEXT",
    status: "PUBLIC",
    createdAt: "2025-03-27T14:56:18.815027Z",
    updatedAt: "2025-03-27T14:56:18.819208Z",
    topic: {
      id: "6b308001-c009-4897-b0fa-bd8f7668adb9",
      name: "Technology",
      postCount: 0,
      color: "#FF0000",
    },
    author: {
      id: "dd01ecbe-f798-4fb5-a56a-184c4ba9e023",
      username: "Bob",
      firstName: "Robert",
      lastName: "Doe",
      avatar:
        "http://localhost:8280/minio/download/commons/cb60520fc3a44acdac56c98d09a7bbea.jpg",
    },
    hasLiked: true,
    hasSaved: true,
  },
  {
    id: "e1a41217-d1d5-4729-950d-da89226d3668",
    content: "Tạo bài viết vào 3/27/2025 9:33, cố gắng hoàn thành xong post..",
    images: [
      "7033bd612e274eb9ba32fe77a7c078ed.jpg",
      "df390a342bfc47a5ba12aac4167ef9dc.jpg",
    ],
    authorId: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
    topicId: "b8e2c6c2-aab6-488e-bf00-a88f0c998bb3",
    commentCount: 0,
    likedCount: 0,
    type: "TEXT",
    status: "PUBLIC",
    createdAt: "2025-03-27T14:33:46.047160Z",
    updatedAt: "2025-03-28T04:01:25.535618Z",
    topic: {
      id: "b8e2c6c2-aab6-488e-bf00-a88f0c998bb3",
      name: "Health",
      postCount: 0,
      color: "#00FF00",
    },
    author: {
      id: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
      username: "Alice",
      firstName: "Alice",
      lastName: "Thompson",
      avatar:
        "http://localhost:8280/minio/download/commons/165d0e01be874bb8b65bcfdcddd1a74a.jpg",
    },
    hasLiked: false,
    hasSaved: false,
  },
  {
    id: "a44782c5-9c51-412c-91f4-15a7a847e9b6",
    content:
      "Hoàn thành Instant.now() to get value of Date when creating Post onbject",
    images: [],
    authorId: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
    topicId: "7b30a1cd-b808-4b2a-b7bf-770011b5ae8c",
    commentCount: 0,
    likedCount: 0,
    type: "TEXT",
    status: "PUBLIC",
    createdAt: "2025-03-27T13:20:13.890369Z",
    updatedAt: "2025-03-27T13:20:13.898760Z",
    topic: {
      id: "7b30a1cd-b808-4b2a-b7bf-770011b5ae8c",
      name: "Computer",
      postCount: 0,
      color: "#00008B",
    },
    author: {
      id: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
      username: "Alice",
      firstName: "Alice",
      lastName: "Thompson",
      avatar:
        "http://localhost:8280/minio/download/commons/165d0e01be874bb8b65bcfdcddd1a74a.jpg",
    },
    hasLiked: false,
    hasSaved: false,
  },
  {
    id: "638ef8bc-ff2c-4475-8f1d-0f8e5ad6fb93",
    content: "Fix new post creation",
    images: ["ec24f4195c304e2784fd0455b5a45bb9.jpg"],
    authorId: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
    topicId: "7b30a1cd-b808-4b2a-b7bf-770011b5ae8c",
    commentCount: 0,
    likedCount: 0,
    type: "TEXT",
    status: "PUBLIC",
    createdAt: "2025-03-27T13:19:07.042096Z",
    updatedAt: "2025-03-27T13:19:07.066349Z",
    topic: {
      id: "7b30a1cd-b808-4b2a-b7bf-770011b5ae8c",
      name: "Computer",
      postCount: 0,
      color: "#00008B",
    },
    author: {
      id: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
      username: "Alice",
      firstName: "Alice",
      lastName: "Thompson",
      avatar:
        "http://localhost:8280/minio/download/commons/165d0e01be874bb8b65bcfdcddd1a74a.jpg",
    },
    hasLiked: false,
    hasSaved: false,
  },
  {
    id: "1b4c8f65-8ecf-481b-900a-a3285f9ae066",
    content: "Fix new post creation",
    images: [
      "b27fe8de15ef4c6e9a20a9d429a852bd.jpg",
      "0db6816e0c914dbfb6074c95edcbc439.jpg",
    ],
    authorId: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
    topicId: "7b30a1cd-b808-4b2a-b7bf-770011b5ae8c",
    commentCount: 0,
    likedCount: 0,
    type: "TEXT",
    status: "PUBLIC",
    createdAt: "2025-03-27T12:41:51.107728Z",
    updatedAt: "2025-03-27T12:41:51.108243Z",
    topic: {
      id: "7b30a1cd-b808-4b2a-b7bf-770011b5ae8c",
      name: "Computer",
      postCount: 0,
      color: "#00008B",
    },
    author: {
      id: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
      username: "Alice",
      firstName: "Alice",
      lastName: "Thompson",
      avatar:
        "http://localhost:8280/minio/download/commons/165d0e01be874bb8b65bcfdcddd1a74a.jpg",
    },
    hasLiked: false,
    hasSaved: false,
  },
  {
    id: "fdc852a9-e3d8-4da3-877f-3c27c0a71286",
    content: "Fix new post creation",
    images: ["261fe3ea72024439b46a6371b5950ca3.jpg"],
    authorId: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
    topicId: "7b30a1cd-b808-4b2a-b7bf-770011b5ae8c",
    commentCount: 0,
    likedCount: 0,
    type: "TEXT",
    status: "PUBLIC",
    createdAt: "2025-03-27T12:41:27.404552Z",
    updatedAt: "2025-03-27T12:41:27.410321Z",
    topic: {
      id: "7b30a1cd-b808-4b2a-b7bf-770011b5ae8c",
      name: "Computer",
      postCount: 0,
      color: "#00008B",
    },
    author: {
      id: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
      username: "Alice",
      firstName: "Alice",
      lastName: "Thompson",
      avatar:
        "http://localhost:8280/minio/download/commons/165d0e01be874bb8b65bcfdcddd1a74a.jpg",
    },
    hasLiked: false,
    hasSaved: false,
  },
  {
    id: "8cfb6584-8ac4-4ae7-a831-b55c63555ff8",
    content: "Fix new post creation",
    images: [
      "3814c2d038ce4285af89f3d3ed84c691.jpg",
      "3e092717d3dc4285aca0a59a188d138e.jpg",
    ],
    authorId: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
    topicId: "6b308001-c009-4897-b0fa-bd8f7668adb9",
    commentCount: 0,
    likedCount: 0,
    type: "TEXT",
    status: "PUBLIC",
    createdAt: "2025-03-27T12:34:47.300169Z",
    updatedAt: "2025-03-27T12:34:47.305975Z",
    topic: {
      id: "6b308001-c009-4897-b0fa-bd8f7668adb9",
      name: "Technology",
      postCount: 0,
      color: "#FF0000",
    },
    author: {
      id: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
      username: "Alice",
      firstName: "Alice",
      lastName: "Thompson",
      avatar:
        "http://localhost:8280/minio/download/commons/165d0e01be874bb8b65bcfdcddd1a74a.jpg",
    },
    hasLiked: false,
    hasSaved: false,
  },
];

const savedPosts = [
  {
    id: "05c3b3de-e46a-4f0d-90cd-faea14924c56",
    content: "Test lại new post.",
    images: [
      "0c0339b68b414070b724dae006fa0401.jpg",
      "ec583460a3e94ab6876506d71e26804d.jpg",
    ],
    authorId: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
    topicId: "6b308001-c009-4897-b0fa-bd8f7668adb9",
    commentCount: 0,
    likedCount: 0,
    type: "TEXT",
    status: "PUBLIC",
    createdAt: "2025-03-28T01:10:54.204963Z",
    updatedAt: "2025-03-28T08:07:55.394245Z",
    topic: {
      id: "6b308001-c009-4897-b0fa-bd8f7668adb9",
      name: "Technology",
      postCount: 0,
      color: "#FF0000",
    },
    author: {
      id: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
      username: "Alice",
      firstName: "Alice",
      lastName: "Thompson",
      avatar:
        "http://localhost:8280/minio/download/commons/165d0e01be874bb8b65bcfdcddd1a74a.jpg",
    },
    hasLiked: false,
    hasSaved: true,
  },
  {
    id: "19cb14f2-cf63-40e3-bc0d-60e405abb64f",
    content:
      "Bob test bài viết mới đây. \r\nThực trạng đáng buồn: Sang Campuchia bị lừa, giải cứu đưa về nước lần 1. Tiếp tục sang lại bị lừa, giải cứu lần 2...",
    images: ["d19725b933d44b9cadb1d0e0d98b6f06.jpg"],
    authorId: "dd01ecbe-f798-4fb5-a56a-184c4ba9e023",
    topicId: "6b308001-c009-4897-b0fa-bd8f7668adb9",
    commentCount: 2,
    likedCount: 1,
    type: "TEXT",
    status: "PUBLIC",
    createdAt: "2025-03-27T14:56:18.815027Z",
    updatedAt: "2025-03-28T14:45:58.487846Z",
    topic: {
      id: "6b308001-c009-4897-b0fa-bd8f7668adb9",
      name: "Technology",
      postCount: 0,
      color: "#FF0000",
    },
    author: {
      id: "dd01ecbe-f798-4fb5-a56a-184c4ba9e023",
      username: "Bob",
      firstName: "Robert",
      lastName: "Doe",
      avatar:
        "http://localhost:8280/minio/download/commons/cb60520fc3a44acdac56c98d09a7bbea.jpg",
    },
    hasLiked: false,
    hasSaved: true,
  },
  {
    id: "16fb0ef3-7b9f-4868-9ea0-eaa98bda0130",
    content: "Low G from the one to the three.. LowGG",
    images: [
      "25b3a25c98564a59a2b2882c03c20dc8.jpg",
      "726ed3d652e84f21af8e94048c7e9c50.jpg",
    ],
    authorId: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
    topicId: "12722c8b-8ab1-4bd5-9be4-1fcd3af373e7",
    commentCount: 3,
    likedCount: 1,
    type: "TEXT",
    status: "PUBLIC",
    createdAt: "2025-03-28T09:00:44.464964Z",
    updatedAt: "2025-03-28T14:46:41.960135Z",
    topic: {
      id: "12722c8b-8ab1-4bd5-9be4-1fcd3af373e7",
      name: "FC LowG",
      postCount: 0,
      color: "#ff8800",
    },
    author: {
      id: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
      username: "Alice",
      firstName: "Alice",
      lastName: "Thompson",
      avatar:
        "http://localhost:8280/minio/download/commons/165d0e01be874bb8b65bcfdcddd1a74a.jpg",
    },
    hasLiked: false,
    hasSaved: true,
  },
  {
    id: "04eef85b-ce0e-40d5-9ceb-33bb39fa0c65",
    content: "test load account nè",
    images: [],
    authorId: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
    topicId: "7b30a1cd-b808-4b2a-b7bf-770011b5ae8c",
    commentCount: 1,
    likedCount: 0,
    type: "TEXT",
    status: "PUBLIC",
    createdAt: "2025-03-29T12:16:53.138741Z",
    updatedAt: "2025-03-29T12:18:29.259396Z",
    topic: {
      id: "7b30a1cd-b808-4b2a-b7bf-770011b5ae8c",
      name: "Computer",
      postCount: 0,
      color: "#00008B",
    },
    author: {
      id: "0a22c812-f19e-4848-8bc7-3fdb69ea5bec",
      username: "Alice",
      firstName: "Alice",
      lastName: "Thompson",
      avatar:
        "http://localhost:8280/minio/download/commons/165d0e01be874bb8b65bcfdcddd1a74a.jpg",
    },
    hasLiked: false,
    hasSaved: true,
  },
];

const samplePost = {
  id: "19cb14f2-cf63-40e3-bc0d-60e405abb64f",
  content:
    "Bob test bài viết mới đây. \r\nThực trạng đáng buồn: Sang Campuchia bị lừa, giải cứu đưa về nước lần 1. Tiếp tục sang lại bị lừa, giải cứu lần 2...",
  images: [
    "4a14048e9dcd47baaab049799a43da3f.jpg",
    "291a945c3eab4300926f77e1b4958e88.jpg",
  ],
  authorId: "dd01ecbe-f798-4fb5-a56a-184c4ba9e023",
  topicId: "6b308001-c009-4897-b0fa-bd8f7668adb9",
  commentCount: 1,
  likedCount: 0,
  type: "TEXT",
  status: "PUBLIC",
  createdAt: "2025-03-27T14:56:18.815027Z",
  updatedAt: "2025-03-27T14:56:18.819208Z",
  topic: {
    id: "6b308001-c009-4897-b0fa-bd8f7668adb9",
    name: "Technology",
    postCount: 0,
    color: "#FF0000",
  },
  author: {
    id: "dd01ecbe-f798-4fb5-a56a-184c4ba9e023",
    username: "Bob",
    firstName: "Robert",
    lastName: "Doe",
    avatar:
      "http://localhost:8280/minio/download/commons/cb60520fc3a44acdac56c98d09a7bbea.jpg",
  },
  hasLiked: false,
  hasSaved: false,
};

export { getPosts, posts, savedPosts, samplePost };
