import api from "./api";

export const getExploreReels = async () => {
  const res = await api.get("/explore/reels");
  return res.data;
};

export const getReelsByCategory = async (category: string) => {
  const res = await api.get(`/explore/category/${category}`);
  return res.data;
};

export const getReelsByCity = async (city: string) => {
  const res = await api.get(`/explore/city/${city}`);
  return res.data;
};
