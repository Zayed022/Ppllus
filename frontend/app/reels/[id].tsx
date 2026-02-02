import { View, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Video } from "expo-av";
import { getReelById } from "@/services/reel.api";



const { height, width } = Dimensions.get("window");

export default function ReelsPlayer() {
  const { id } = useLocalSearchParams();
  const videoRef = useRef<Video>(null);
  const [reel, setReel] = useState<any>(null);

  useEffect(() => {
    loadReel();
  }, []);

  const loadReel = async () => {
    const data = await getReelById(id as string);
    setReel(data);
  };

  if (!reel) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Video
        ref={videoRef}
        source={{ uri: reel.videoUrl }}
        style={{ width, height }}
        resizeMode="cover"
        shouldPlay
        isLooping
        useNativeControls={false}
      />
    </View>
  );
}
