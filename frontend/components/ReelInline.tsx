import { View, Dimensions, StyleSheet, Pressable } from "react-native";
import { Video } from "expo-av";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");
const INLINE_HEIGHT = height * 0.75;

export default function ReelInline({ reel }: { reel: any }) {
  const videoRef = useRef<Video>(null);
  const router = useRouter();

  useEffect(() => {
    // autoplay when mounted
    videoRef.current?.playAsync();

    return () => {
      videoRef.current?.pauseAsync();
    };
  }, []);

  if (!reel?.videoUrl) return null;

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        router.push(`/reels/${reel._id}`)
      }
    >
      <Video
  ref={videoRef}
  source={{ uri: reel.videoUrl }}
  style={styles.video}
  resizeMode="cover"
  isLooping
  shouldPlay
  isMuted={true}
  useNativeControls={false}
  progressUpdateIntervalMillis={250}
  onError={(e) => console.log("VIDEO ERROR", e)}
/>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height: INLINE_HEIGHT,
    backgroundColor: "#000",
    marginBottom: 12,
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
