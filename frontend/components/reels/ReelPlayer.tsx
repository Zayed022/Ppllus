import { View, Dimensions, StyleSheet } from "react-native";
import { Video } from "expo-av";
import { useEffect, useRef } from "react";
import { recordReelView } from "@/services/reel.api";
import ReelActions from "./ReelActions";
import ReelMeta from "./ReelMeta";

const { height, width } = Dimensions.get("window");

export default function ReelPlayer({
  reel,
  isActive,
}: {
  reel: any;
  isActive: boolean;
}) {
  const videoRef = useRef<Video>(null);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      startTime.current = Date.now();
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();

      if (startTime.current) {
        const watchTime =
          Math.floor((Date.now() - startTime.current) / 1000);

        if (watchTime > 0) {
          recordReelView(reel._id, watchTime);
        }
      }
    }
  }, [isActive]);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: reel.videoUrl }}
        style={styles.video}
        resizeMode="cover"
        isLooping
        pointerEvents="none"
      />

      <ReelMeta reel={reel} />
      <ReelActions reel={reel} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: "#000",
  },
  video: {
    width,
    height,
    position: "absolute",
  },
});
