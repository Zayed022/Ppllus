import { FlatList } from "react-native";
import { useEffect, useRef, useState } from "react";
import { getHomeFeed } from "@/services/feed.api";
import { FeedItem } from "@/types/feed";
import StoriesRow from "@/components/StoriesRow";
import PostCard from "./PostCard";
import ReelInline from "./ReelInline";


export default function HomeFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // 🔑 Track IDs already rendered
  const seenIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    if (loadingMore) return;

    setLoadingMore(true);
    const data = await getHomeFeed(cursor);

    const uniqueItems: FeedItem[] = [];

    for (const item of data.items) {
      const id =
        item.type === "POST"
          ? `post-${item.post._id}`
          : `reel-${item.reel._id}`;

      if (!seenIds.current.has(id)) {
        seenIds.current.add(id);
        uniqueItems.push(item);
      }
    }

    setItems(prev => [...prev, ...uniqueItems]);
    setCursor(data.nextCursor);
    setLoadingMore(false);
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(item) =>
        item.type === "POST"
          ? `post-${item.post._id}`
          : `reel-${item.reel._id}`
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
      showsVerticalScrollIndicator={false}
    />
  );
}


