export const normalizeUserSignals = (raw = {}) => {
    return {
      following: new Set(raw.following || []),
      categories: new Set(raw.categories || []),
    };
  };
  