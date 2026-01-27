import api from "./api";

export const getMyReels = async () => {
  const res = await api.get("/reel/me");
  return res.data;
};

export const getReelById = async (reelId: string) => {
    const res = await api.get(`/reel/${reelId}`);
    return res.data;
  };

  export const getReelFeed = async (cursor?: string) => {
    const res = await api.get("/reel/feed", {
      params: { cursor },
    });
    return res.data;
  };
  
  export const recordReelView = async (
    reelId: string,
    watchTime: number
  ) => {
    const res = await api.post(`/reel/${reelId}/view`, {
      watchTime,
    });
    return res.data; // { viewed: boolean }
  };
  
  export const toggleLikeReel = async (reelId: string) => {
    const res = await api.post(`/reel/${reelId}/like`);
    return res.data; // { liked: boolean }
  };
  
  
  export const shareReel = async (reelId: string) => {
    await api.post(`/reel/${reelId}/share`);
  };

  export const getReelComments = async (reelId: string) => {
    const res = await api.get(`/reel/${reelId}/comments`);
    return res.data;
  };

  export const addReelComment = async (
    reelId: string,
    text: string,
    parentComment?: string
  ) => {
    const res = await api.post(`/reel/${reelId}/comments`, {
      text,
      parentComment,
    });
    return res.data;
  };

  export const createReel = async (formData: FormData) => {
    const res = await api.post("/reel/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  };

  
