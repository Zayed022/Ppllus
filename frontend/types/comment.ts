export type Comment = {
    _id: string;
    text: string;
    likesCount: number;
    isLiked?: boolean;
    createdAt: string;
    user: {
      _id: string;
      username: string;
      profileImage: string;
    };
  };
  