export type Story = {
    _id: string;
    mediaUrl: string;
    mediaType: "IMAGE" | "VIDEO";
    duration?: number;
    createdAt: string;
  };
  
  export type StoryGroup = {
    user: string;
    username: string;
    profileImage?: string | null;
    stories: Story[];
    hasUnseen: boolean;
    isSelf: boolean;
  };
  
  