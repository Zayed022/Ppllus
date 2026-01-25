import api from "./api";

/** Get followers of a user */
export const getFollowers = async (userId: string) => {
  const res = await api.get(`/follow/followers/${userId}`);
  return res.data;
};

/** Get users that this user follows */
export const getFollowing = async (userId: string) => {
  const res = await api.get(`/follow/following/${userId}`);
  return res.data;
};
