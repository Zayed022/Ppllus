import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { toggleLikeReel, shareReel } from "@/services/reel.api";
import { useRouter } from "expo-router";
import { openShareSheet } from "@/utils/share";


export default function ReelActions({ reel }: { reel: any }) {
  const router = useRouter();

  const [liked, setLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState(reel.likesCount);
  const [views] = useState(reel.viewsCount);

  const onLike = async () => {
    const optimistic = !liked;

    setLiked(optimistic);
    setLikes(c => optimistic ? c + 1 : c - 1);

    try {
      const res = await toggleLikeReel(reel._id);
      setLiked(res.liked);
    } catch {
      setLiked(!optimistic);
      setLikes(c => optimistic ? c - 1 : c + 1);
    }
  };

  const onShare = async () => {
    try {
      await openShareSheet({
        message: "Watch this reel on Ppllus",
        url: `https://ppllus.com/reel/${reel._id}`,
      });
  
      // fire-and-forget backend
      shareReel(reel._id).catch(() => {});
    } catch (e) {
      console.log("Share cancelled");
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Action
        icon={liked ? "heart" : "heart-outline"}
        value={likes}
        active={liked}
        onPress={onLike}
      />

      <Action
        icon="chatbubble-outline"
        onPress={() =>
          router.push({
            pathname: "/modal/reel-comments",
            params: { reelId: reel._id },
          })
        }
      />

      <Action icon="paper-plane-outline" onPress={onShare} />

      <Text style={styles.views}>
        {views.toLocaleString()} views
      </Text>
    </View>
  );
}

function Action({
  icon,
  value,
  active,
  onPress,
}: any) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: true }}
      style={styles.action}
    >
      <Ionicons
        name={icon}
        size={28}
        color={active ? "#ed4956" : "#fff"}
      />
      {value !== undefined && (
        <Text style={styles.text}>{value}</Text>
      )}
    </Pressable>
  );
}


const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 12,
    bottom: 90,
    alignItems: "center",
  },
  action: {
    marginBottom: 18,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
  views: {
    color: "#fff",
    fontSize: 12,
    marginTop: 10,
  },
});
