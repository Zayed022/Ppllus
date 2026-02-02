import api from "./api";

export const getExplorePosts = async (cursor = 0) => {
  const res = await api.get("/explore/explore/posts", {
    params: { cursor, limit: 21 },
  });
  return res.data;
};

export const getExploreReels = async (cursor = 0) => {
  const res = await api.get("/explore/explore", {
    params: { cursor, limit: 9 },
  });
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

export const getExploreFeed = async (cursor?: string) => {
  const res = await api.get("/explore/feed", {
    params: { cursor },
  });
  return res.data;
};