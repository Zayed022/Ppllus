import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getReelById } from "@/services/reel.api";
import ReelPlayer from "@/components/reels/ReelPlayer";

export default function ReelScreen() {
  const { reelId } = useLocalSearchParams<{ reelId: string }>();
  const [reel, setReel] = useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getReelById(reelId);
    setReel(data);
  };

  if (!reel) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return <ReelPlayer reel={reel} />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});
