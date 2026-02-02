export const mergeExplore = (posts: any[], reels: any[]) => {
    const result: any[] = [];
  
    let p = 0;
    let r = 0;
  
    while (p < posts.length || r < reels.length) {
      // Instagram-like ratio: 4 posts → 1 reel
      for (let i = 0; i < 4 && p < posts.length; i++) {
        result.push({ type: "POST", data: posts[p++] });
      }
  
      if (r < reels.length) {
        result.push({ type: "REEL", data: reels[r++] });
      }
    }
  
    return result;
  };
  