import api from "@/services/api";
import { router } from "expo-router";

export const getMyProfileImage = async () => {
  const res = await api.get("/users/me/profile-image");
  return res.data;
};

export const getUserStories = async (userId: string) => {
  const res = await api.get(`/story/${userId}`);
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

export const deleteStory = async (storyId: string) => {
  await api.delete(`/story/${storyId}`);
  router.back(); // exit viewer
};

export const muteUser = async (userId: string) => {
  await api.post(`/story/mute/${userId}`);
};

export const unmuteUser = async (userId: string) => {
  await api.post(`/story/unmute/${userId}`);
};

export const loadViewers = async (storyId: string) => {
  const res = await api.get(`/story/${storyId}/viewers`);
  setViewers(res.data.viewers);
};

const addToHighlight = async (highlightId: string, storyId: string) => {
  await api.post(`/story/highlights/${highlightId}/${storyId}`);
};


