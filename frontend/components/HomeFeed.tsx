import { FlatList, View } from "react-native";
import StoriesRow from "@/components/StoriesRow";

import ReelInline from "@/components/ReelInline";
import { getHomeFeed } from "@/services/feed.api";
import { useEffect, useState } from "react";
import PostCard from "./feed/PostCard";

export default function Feed() {
  const [items, setItems] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    const data = await getHomeFeed(cursor);
    setItems(prev => [...prev, ...data.items]);
    setCursor(data.nextCursor);
  };

  return (
    <FlatList
      ListHeaderComponent={<StoriesRow />}
      data={items}
      keyExtractor={(_, i) => i.toString()}
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
