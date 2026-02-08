import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
  Text,
  Animated,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { toggleLikeReel } from "@/services/reel.api";

const { width } = Dimensions.get("window");
const HEIGHT = width * 1.25;

export default function ReelInline({
  reel,
  isActive,
}: {
  reel: any;
  isActive: boolean;
}) {
  const router = useRouter();
  const videoRef = useRef<Video>(null);

  const [liked, setLiked] = useState(!!reel.isLiked);
  const [likesCount, setLikesCount] = useState(reel.likesCount);
  const [isLoaded, setIsLoaded] = useState(false);
  const [paused, setPaused] = useState(false);

  /* ---------------- DOUBLE TAP ---------------- */
  const lastTap = useRef(0);
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;
  const heartPos = useRef({ x: 0, y: 0 });

  /* ---------------- AUTOPLAY ---------------- */
  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive && !paused) {
      videoRef.current.playAsync();
    } else {
      videoRef.current.pauseAsync();
    }
  }, [isActive, paused]);

  /* ---------------- HEART ANIMATION ---------------- */
  const animateHeart = () => {
    heartScale.setValue(0.4);
    heartOpacity.setValue(1);

    Animated.parallel([
      Animated.spring(heartScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(heartOpacity, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /* ---------------- TAP HANDLER ---------------- */
  const onTap = (e: any) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 280;

    const { locationX, locationY } = e.nativeEvent;

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // ❤️ DOUBLE TAP
      heartPos.current = {
        x: locationX - 50,
        y: locationY - 50,
      };

      animateHeart();

      if (!liked) {
        setLiked(true);
        setLikesCount(c => c + 1);
        toggleLikeReel(reel._id).catch(() => {});
      }
    } else {
      // SINGLE TAP → pause/play
      setPaused(p => !p);
    }

    lastTap.current = now;
  };

  /* ---------------- LIKE BUTTON ---------------- */
  const onLikePress = async () => {
    const optimistic = !liked;
    setLiked(optimistic);
    setLikesCount(c => (optimistic ? c + 1 : c - 1));

    try {
      const res = await toggleLikeReel(reel._id);
      setLiked(res.liked);
    } catch {
      setLiked(!optimistic);
      setLikesCount(reel.likesCount);
    }
  };

  return (
    <View style={styles.container}>
      {/* VIDEO TOUCH AREA */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onTap}>
        <Video
          ref={videoRef}
          source={{ uri: reel.videoUrl }}
          style={styles.video}
          resizeMode="cover"
          isLooping
          isMuted
          shouldPlay={isActive}
          useNativeControls={false}
          progressUpdateIntervalMillis={250}
          onLoad={() => setIsLoaded(true)}
          posterSource={{ uri: reel.thumbnailUrl }}
          usePoster
        />

        {!isLoaded && (
          <Image
            source={{ uri: reel.thumbnailUrl }}
            style={styles.poster}
          />
        )}

        {/* ❤️ HEART */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.heart,
            {
              left: heartPos.current.x,
              top: heartPos.current.y,
              opacity: heartOpacity,
              transform: [{ scale: heartScale }],
            },
          ]}
        >
          <Ionicons name="heart" size={100} color="#fff" />
        </Animated.View>
      </Pressable>

      {/* LEFT INFO */}
      <View style={styles.leftOverlay}>
        <Pressable
          style={styles.userRow}
          onPress={() =>
            router.push(`/profile/${reel.creator._id}`)
          }
        >
          <Image
            source={{ uri: reel.creator.profileImage }}
            style={styles.avatar}
          />
          <Text style={styles.username}>
            {reel.creator.username}
          </Text>
        </Pressable>

        {reel.caption && (
          <Text style={styles.caption} numberOfLines={2}>
            {reel.caption}
          </Text>
        )}
      </View>

      {/* RIGHT ACTIONS */}
      <View style={styles.rightOverlay}>
        <Pressable onPress={onLikePress}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={30}
            color={liked ? "#ed4956" : "#fff"}
          />
        </Pressable>
        <Text style={styles.count}>{likesCount}</Text>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/modal/reel-comments",
              params: { reelId: reel._id },
            })
          }
        >
          <Ionicons
            name="chatbubble-outline"
            size={28}
            color="#fff"
          />
        </Pressable>
        <Text style={styles.count}>
          {reel.commentsCount}
        </Text>

        <Ionicons
          name="paper-plane-outline"
          size={28}
          color="#fff"
        />
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    width,
    height: HEIGHT,
    backgroundColor: "#000",
    marginBottom: 20,
  },

  video: {
    width,
    height: "100%",
  },

  poster: {
    position: "absolute",
    width,
    height: "100%",
    resizeMode: "cover",
  },

  heart: {
    position: "absolute",
    zIndex: 10,
  },

  leftOverlay: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 80,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#fff",
  },

  username: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  caption: {
    color: "#fff",
    fontSize: 13,
  },

  rightOverlay: {
    position: "absolute",
    right: 12,
    bottom: 20,
    alignItems: "center",
    gap: 14,
  },

  count: {
    color: "#fff",
    fontSize: 12,
  },
});
