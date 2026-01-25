import { View, FlatList, Dimensions } from "react-native";
import { useEffect, useRef, useState } from "react";
import { getReelFeed } from "@/services/reel.api";
import ReelPlayer from "@/components/reels/ReelPlayer";

const { height } = Dimensions.get("window");

export default function ReelsFeed() {
  const [reels, setReels] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    const data = await getReelFeed(cursor);
    setReels(prev => [...prev, ...data.items]);
    setCursor(data.nextCursor);
  };

  return (
    <FlatList
      data={reels}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item._id}
      onEndReached={loadFeed}
      onEndReachedThreshold={0.4}
      renderItem={({ item, index }) => (
        <ReelPlayer
          reel={item}
          isActive={index === currentIndex.current}
        />
      )}
      onMomentumScrollEnd={(e) => {
        currentIndex.current = Math.round(
          e.nativeEvent.contentOffset.y / height
        );
      }}
    />
  );
}
