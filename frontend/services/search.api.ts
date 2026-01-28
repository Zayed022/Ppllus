import api from "./api";

export const searchUsers = async (query: string) => {
  if (!query || query.length < 2) return [];

  const res = await api.get("/users/search2", {
    params: { q: query },
  });

  return res.data;
};
