import { takeEvery } from "redux-saga/effects";
import { all, call, put } from "typed-redux-saga";
import { commonStore, postStore } from "../reducers";
import backendClient from "@/utils/BackendClient";

function* getPostComments(payload: any) {
  const postId = payload.payload;
  try {
    // endpoints: /comments/:postId
    const comments: any = yield* call(
      backendClient.getCommentsByPostId,
      postId
    );
    if (!comments?.data) {
      return;
    }
    const result = comments?.data.data;
    yield put(postStore.actions.setCurrentPostComments(result.data));
  } catch (error) {
    yield* put(
      commonStore.actions.setErrorMessage("Failed to get post comments")
    );
  }
}

function* getPosts(payload: any) {
  const { pageNum, filter } = payload.payload;
  try {
    yield* put(postStore.actions.setLoading(true));
    // endpoints: /posts?page=:pageNum
    const response: {
      data: {
        data: {
          data: any[];
          currentPage: number;
          totalPages: number;
        };
      };
    } = yield* call(backendClient.getPostsPerPage, pageNum, filter);
    const { data, currentPage, totalPages } = response.data.data;

    // put posts to store
    yield put(
      postStore.actions.fecthPostsPaging({
        posts: data,
        currentPage,
        totalPages,
      })
    );
  } catch (error) {
    yield* put(commonStore.actions.setErrorMessage("Failed to get posts"));
  }
}

function* getRecPosts(payload: any) {
  const { pageNum } = payload.payload;
  try {
    yield* put(postStore.actions.setLoading(true));
    // endpoints: /rec/rec-posts?page=:pageNum
    const response: {
      data: {
        data: {
          data: any[];
          currentPage: number;
          totalPages: number;
        };
      };
    } = yield* call(backendClient.getRecPosts, pageNum);
    const { data, currentPage, totalPages } = response.data.data;

    // put posts to store
    yield put(
      postStore.actions.fecthPostsPaging({
        posts: data,
        currentPage,
        totalPages,
      })
    );
  } catch (error) {
    yield* put(commonStore.actions.setErrorMessage("Failed to get posts"));
  }
}

function* likePost(payload: any) {
  const postId = payload.payload;
  try {
    backendClient.likePost(postId);
    yield put(postStore.actions.likePost(postId));
  } catch (error) {
    yield* put(commonStore.actions.setErrorMessage("Failed to like post"));
  }
}

function* unlikePost(payload: any) {
  const postId = payload.payload;
  try {
    backendClient.unLikePost(postId);
    yield put(postStore.actions.unlikePost(postId));
  } catch (error) {
    yield* put(commonStore.actions.setErrorMessage("Failed to unlike post"));
  }
}

function* savePost(payload: any) {
  const { authorId, postId } = payload.payload;
  try {
    backendClient.bookmarkPost({ authorId, postId });
    yield put(postStore.actions.savePost(postId));
  } catch (error) {
    yield* put(commonStore.actions.setErrorMessage("Failed to save post"));
  }
}

function* unSavePost(payload: any) {
  const { authorId, postId } = payload.payload;
  try {
    backendClient.unBookmarkPost({ authorId, postId });
    yield put(postStore.actions.unSavePost(postId));
  } catch (error) {
    yield* put(commonStore.actions.setErrorMessage("Failed to unsave post"));
  }
}

function* addComment(payload: any) {
  const { postId, content } = payload.payload;
  try {
    const response = yield* call(backendClient.createComment, {
      postId,
      content,
    });
    if (!response?.data) {
      return;
    }
    const comment = response.data.data;
    yield put(postStore.actions.addComment({ postId, comment }));
  } catch (error) {
    console.log(error);
    yield* put(commonStore.actions.setErrorMessage("Failed to add comment"));
  }
}

function* likeComment(payload: any) {
  const commentId = payload.payload;
  try {
    backendClient.likeComment(commentId);
    yield put(postStore.actions.likeComment(commentId));
  } catch (error) {
    yield* put(commonStore.actions.setErrorMessage("Failed to like comment"));
  }
}

function* unlikeComment(payload: any) {
  const commentId = payload.payload;
  try {
    backendClient.unLikeComment(commentId);
    yield put(postStore.actions.unlikeComment(commentId));
  } catch (error) {
    yield* put(commonStore.actions.setErrorMessage("Failed to unlike comment"));
  }
}

function* deleteComment(payload: any) {
  const commentId = payload.payload;
  try {
    backendClient.deleteComment(commentId);
    yield put(postStore.actions.deleteComment(commentId));
  } catch (error) {
    yield* put(commonStore.actions.setErrorMessage("Failed to delete comment"));
  }
}

function* deletePost(payload: any) {
  const postId = payload.payload;
  try {
    backendClient.deletePost(postId);
    yield put(postStore.actions.deletePost(postId));
  } catch (error) {
    yield* put(commonStore.actions.setErrorMessage("Failed to delete post"));
  }
}

function* postSaga() {
  yield takeEvery(postStore.getPostComments, getPostComments);
  yield takeEvery(postStore.getPosts, getPosts);
  yield takeEvery(postStore.likePost, likePost);
  yield takeEvery(postStore.unlikePost, unlikePost);
  yield takeEvery(postStore.savePost, savePost);
  yield takeEvery(postStore.unSavePost, unSavePost);
  yield takeEvery(postStore.addComment, addComment);
  yield takeEvery(postStore.likeComment, likeComment);
  yield takeEvery(postStore.unlikeComment, unlikeComment);
  yield takeEvery(postStore.deleteComment, deleteComment);
  yield takeEvery(postStore.deletePost, deletePost);
  yield takeEvery(postStore.getRecPosts, getRecPosts);
}

export default postSaga;
