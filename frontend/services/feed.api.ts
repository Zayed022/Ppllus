import api from "@/services/api";

export const getHomeFeed = async (cursor?: string) => {
  const res = await api.get("/feed/home", {
    params: { cursor },
  });
  return res.data;
};
