import {
  View,
  FlatList,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { getStoryFeed } from "@/services/story.api";
import { StoryGroup } from "@/types/story";
import StoryAvatar from "./StoryAvatar";
import { storyEvents } from "@/utils/storyEvents";



export default function StoriesRow() {
  const [stories, setStories] = useState<StoryGroup[]>([]);
  const [loading, setLoading] = useState(true);

  /* ==========================
     INITIAL LOAD
  ========================== */
  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const data = await getStoryFeed();
      setStories(data);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================
     🔥 REAL-TIME SEEN UPDATE
  ========================== */
  useEffect(() => {
    const seenMap = new Map<string, Set<string>>();
  
    const unsubscribe = storyEvents.subscribe(
      ({ userId, storyId }) => {
        setStories(prev =>
          prev.map(group => {
            if (group.user !== userId) return group;
  
            if (!seenMap.has(userId)) {
              seenMap.set(userId, new Set());
            }
  
            const seenSet = seenMap.get(userId)!;
            seenSet.add(storyId);
  
            const allSeen =
              seenSet.size >= group.stories.length;
  
            return {
              ...group,
              hasUnseen: !allSeen,
            };
          })
        );
      }
    );
  
    return unsubscribe;
  }, []);
  

  if (loading) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.user}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <StoryAvatar group={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
  },
  list: {
    paddingHorizontal: 12,
  },
});
