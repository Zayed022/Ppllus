import {
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import ReelItem from "@/components/reels/ReelItem";
import { getReelFeed } from "@/services/reel.api";
import { preloadReel } from "@/utils/useReelPreload";
import { getExploreFeed } from "@/services/explore.api";

const { height } = Dimensions.get("window");

export default function ActivityScreen() {
  const [reels, setReels] = useState<any[]>([]);
  const [cursor, setCursor] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: any) => {
      if (viewableItems.length > 0) {
        const index = viewableItems[0].index;
        setActiveIndex(index);

        const next = reels[index + 1];
        if (next) {
          preloadReel(next.videoUrl);
        }
      }
    }
  ).current;

  useEffect(() => {
    loadMore();
  }, []);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);

    const res = await getExploreFeed(cursor);
    setReels(prev => [...prev, ...res.data]);
    setCursor(res.nextCursor);

    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <FlatList
        data={reels}
        keyExtractor={item => item._id}
        renderItem={({ item, index }) => (
          <ReelItem
            reel={item}
            isActive={index === activeIndex}
          />
        )}
        pagingEnabled
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        ListFooterComponent={
          loading ? <ActivityIndicator color="#fff" /> : null
        }
      />
    </View>
  );
}
