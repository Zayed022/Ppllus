import api from "@/services/api";

export const getMyProfileImage = async () => {
  const res = await api.get("/users/me/profile-image");
  return res.data;
};

export const getMyActiveStories = async () => {
  const res = await api.get("/story/me");
  return res.data;
};

export const getStoryFeed = async () => {
  const res = await api.get("/story/feed");
  return res.data;
};

export const markStoryViewed = async (storyId: string) => {
  await api.post(`/story/${storyId}/view`);
};
