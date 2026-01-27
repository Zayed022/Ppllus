import { FlatList, View } from "react-native";
import StoriesRow from "@/components/StoriesRow";

import ReelInline from "@/components/ReelInline";
import { getHomeFeed } from "@/services/feed.api";
import { useCallback, useEffect, useState } from "react";
import PostCard from "./feed/PostCard";
import { useFocusEffect } from "expo-router";

export default function HomeFeed() {
  const [items, setItems] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);

  const loadFeed = async () => {
    const data = await getHomeFeed(cursor);

    const normalized = data.items.map((item: any) => {
      if (item.videoUrl) {
        return { type: "REEL", reel: item };
      }
      return { type: "POST", post: item };
    });

    setItems((prev) => [...prev, ...normalized]);
    setCursor(data.nextCursor);
  };

  useFocusEffect(
    useCallback(() => {
      setItems([]);
      setCursor(null);
      loadFeed();
    }, [])
  );

  return (
    <FlatList
      ListHeaderComponent={<StoriesRow />}
      data={items}
      keyExtractor={(item) =>
        item.type === "REEL"
          ? `reel-${item.reel._id}`
          : `post-${item.post._id}`
      }
      renderItem={({ item }) => {
        if (item.type === "POST") {
          return <PostCard post={item.post} />;
        }
        if (item.type === "REEL") {
          return <ReelInline reel={item.reel} />;
        }
        return null;
      }}
      onEndReached={loadFeed}
      onEndReachedThreshold={0.5}
    />
  );
}

