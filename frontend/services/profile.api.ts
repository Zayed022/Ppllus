import api from "./api";

export const getUserProfile = async (userId: string) => {
  const res = await api.get(`/users/${userId}/profile`);
  return res.data;
};

export const getUserPosts = async (userId: string) => {
  const res = await api.get(`/post/user/${userId}`);
  return res.data;
};
