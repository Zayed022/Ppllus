type StorySeenListener = (payload: {
  userId: string;
  storyId: string;
}) => void;

const listeners = new Set<StorySeenListener>();

export const storyEvents = {
  emitStorySeen(payload: { userId: string; storyId: string }) {
    listeners.forEach(fn => fn(payload));
  },

  subscribe(fn: StorySeenListener): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
