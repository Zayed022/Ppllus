import api from "./api";


export const getSuggestedUsers = async () => {
  const res = await api.get("/discovery/suggested-users");
  return res.data;
};

export const followUser = async (userId: string) => {
  const res = await api.post(`/follow/${userId}`);
  return res.data;
};
