export const categoryColors: Record<string, string> = {
    food: "#FF6B6B",
    retail: "#4ECDC4",
    pharmacy: "#1A73E8",
    gym: "#9B5DE5",
    default: "#333",
  };
  
  export const getMarkerColor = (category: string) => {
    return categoryColors[category?.toLowerCase()] || categoryColors.default;
  };
  