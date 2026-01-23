export type FeedPost = {
    _id: string;
    author: {
      _id: string;
      username: string;
      profileImage?: string;
    };
    media: {
      url: string;
      type: "IMAGE" | "VIDEO";
      width?: number;
      height?: number;
    }[];
    caption?: string;
    likesCount: number;
    commentsCount: number;
    isLiked?: boolean;
    createdAt: string;
  };
  
  export type FeedReel = {
    _id: string;
    videoUrl: string;
    thumbnailUrl?: string;
    viewsCount: number;
  };
  
  export type FeedItem =
    | { type: "POST"; post: FeedPost }
    | { type: "REEL"; reel: FeedReel };
  
  export type HomeFeedResponse = {
    items: FeedItem[];
    nextCursor: string | null;
  };
  