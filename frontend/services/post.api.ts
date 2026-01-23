import api from "./api";

export const toggleLikePost = async (postId: string) => {
  const res = await api.post(`/post/${postId}/like`);
  return res.data as { liked: boolean };
};

export const getPostComments = async (
  postId: string,
  cursor?: string
) => {
  const res = await api.get(`/comment/posts/${postId}/comments`, {
    params: { cursor },
  });
  return res.data;
};

export const createPostComment = async (
  postId: string,
  text: string
) => {
  const res = await api.post(`/comment/posts/${postId}/comments`, {
    text,
  });
  return res.data;
};
