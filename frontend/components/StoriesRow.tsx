import {
    View,
    Text,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
  } from "react-native";
  import { useEffect, useState } from "react";
  import { getStoryFeed } from "@/services/story.api";
  import { StoryGroup } from "@/types/story";
import StoryAvatar from "./StoryAvatar";
  
  export default function StoriesRow() {
    const [stories, setStories] = useState<StoryGroup[]>([]);
    const [loading, setLoading] = useState(true);
  
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
  