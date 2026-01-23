import { FlatList } from "react-native";
import { useEffect, useState } from "react";
import { getHomeFeed } from "@/services/feed.api";
import { FeedItem } from "@/types/feed";
import StoriesRow from "@/components/StoriesRow";
import PostCard from "./PostCard";
import ReelInline from "./ReelInline";


export default function HomeFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    if (loadingMore) return;

    setLoadingMore(true);
    const data = await getHomeFeed(cursor);

    setItems(prev => [...prev, ...data.items]);
    setCursor(data.nextCursor);
    setLoadingMore(false);
  };

  return (
    <FlatList
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
      showsVerticalScrollIndicator={false}
    />
  );
}
