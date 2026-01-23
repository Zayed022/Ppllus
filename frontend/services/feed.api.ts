import api from "./api";
import { HomeFeedResponse } from "@/types/feed";

export const getHomeFeed = async (cursor?: string | null) => {
  const res = await api.get<HomeFeedResponse>("/feed/home", {
    params: { cursor },
  });
  return res.data;
};
