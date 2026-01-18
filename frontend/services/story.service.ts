import api from "./api";

export interface Story {
  _id: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  duration?: number;
  createdAt: string;
  seen: boolean;
}

export interface StoryUser {
  user: {
    _id: string;
    username: string;
    profileImage: string;
  };
  stories: Story[];
  hasUnseen: boolean;
}

export const fetchStoryFeed = async (): Promise<StoryUser[]> => {
  const res = await api.get("/stories/feed");
  return res.data;
};

export const markStoryViewed = async (storyId: string) => {
  await api.post(`/stories/${storyId}/view`);
};
