import api from "@/services/api";

export const getPostComments = async (
  postId: string,
  cursor?: string
) => {
  const res = await api.get(
    `/comment/posts/${postId}/comments`,
    { params: { cursor } }
  );
  return res.data;
};

export const addPostComment = async (
  postId: string,
  text: string
) => {
  const res = await api.post(
    `/comment/posts/${postId}/comments`,
    { text }
  );
  return res.data;
};

export const toggleLikeComment = async (commentId: string) => {
  const res = await api.post(
    `/comment/comments/${commentId}/like`
  );
  return res.data;
};
