import {
    View,
    Dimensions,
    Pressable,
    Text,
    Image,
    StyleSheet,
    Animated,
  } from "react-native";
  import { useEffect, useRef, useState } from "react";
  import { Video } from "expo-av";
  import { Ionicons } from "@expo/vector-icons";
  import {
    toggleLikeReel,
    shareReel,
    recordReelView,
  } from "@/services/reel.api";
  import { useRouter } from "expo-router";
  
  const { height, width } = Dimensions.get("window");
  
  export default function ReelItem({
    reel,
    isActive,
  }: {
    reel: any;
    isActive: boolean;
  }) {
    const router = useRouter();
    const videoRef = useRef<Video>(null);
  
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [muted, setMuted] = useState(false);
  
    const watchStart = useRef<number | null>(null);
  
    /* ---------------- DOUBLE TAP ❤️ ANIMATION ---------------- */
    const heartScale = useRef(new Animated.Value(0)).current;
    const heartOpacity = useRef(new Animated.Value(0)).current;
    const lastTap = useRef<number>(0);
  
    /* ---------------- PROGRESS BAR ---------------- */
    const progress = useRef(new Animated.Value(0)).current;
    const durationRef = useRef(1);
  
    /* ---------------- INIT ---------------- */
    useEffect(() => {
      setLiked(!!reel.isLiked);
      setLikesCount(reel.likesCount);
    }, [reel._id]);
  
    /* ---------------- PLAY / PAUSE ---------------- */
    useEffect(() => {
      if (isActive) {
        videoRef.current?.playAsync();
        watchStart.current = Date.now();
      } else {
        videoRef.current?.pauseAsync();
        flushWatchTime();
        progress.setValue(0);
      }
    }, [isActive]);
  
    /* ---------------- WATCH TIME ---------------- */
    const flushWatchTime = () => {
      if (!watchStart.current) return;
      const duration =
        (Date.now() - watchStart.current) / 1000;
      recordReelView(reel._id, duration);
      watchStart.current = null;
    };
  
    /* ---------------- DOUBLE TAP LIKE ---------------- */
    const onPress = () => {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        triggerHeart();
  
        if (!liked) {
          setLiked(true);
          setLikesCount(c => c + 1);
          toggleLikeReel(reel._id).catch(() => {});
        }
      }
      lastTap.current = now;
    };
  
    const triggerHeart = () => {
      heartScale.setValue(0.3);
      heartOpacity.setValue(1);
  
      Animated.parallel([
        Animated.spring(heartScale, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(heartOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    };
  
    /* ---------------- LIKE BUTTON ---------------- */
    const onLike = async () => {
      const optimistic = !liked;
      setLiked(optimistic);
      setLikesCount(c => (optimistic ? c + 1 : c - 1));
  
      try {
        const res = await toggleLikeReel(reel._id);
        setLiked(res.liked);
      } catch {
        setLiked(liked);
        setLikesCount(likesCount);
      }
    };
  
    return (
      <View style={{ height, width }}>
        {/* PROGRESS BAR (STEP 5) */}
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            height: 3,
            backgroundColor: "#fff",
            width: progress.interpolate({
              inputRange: [0, durationRef.current],
              outputRange: ["0%", "100%"],
            }),
            zIndex: 10,
          }}
        />
  
        {/* VIDEO */}
        <Pressable
          style={{ height, width }}
          onPress={onPress}
          onLongPress={() =>
            videoRef.current
              ?.setIsMutedAsync(!muted)
              .then(() => setMuted(m => !m))
          }
        >
          <Video
            ref={videoRef}
            source={{ uri: reel.videoUrl }}
            posterSource={{ uri: reel.thumbnailUrl }}
            usePoster
            style={{ height, width }}
            resizeMode="cover"
            isLooping
            shouldPlay={false}
            isMuted={muted}
            useNativeControls={false}
            progressUpdateIntervalMillis={200}
            onPlaybackStatusUpdate={(s: any) => {
              if (!s.isLoaded) return;
              durationRef.current = s.durationMillis || 1;
              progress.setValue(s.positionMillis || 0);
            }}
          />
  
          {/* HEART ANIMATION */}
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: "40%",
              left: "40%",
              opacity: heartOpacity,
              transform: [{ scale: heartScale }],
            }}
          >
            <Ionicons name="heart" size={100} color="#fff" />
          </Animated.View>
        </Pressable>
  
        {/* OVERLAY */}
        <View style={styles.overlay}>
          {/* LEFT */}
          <View style={styles.left}>
            <Pressable
              onPress={() =>
                router.push(`/profile/${reel.creator._id}`)
              }
              style={styles.userRow}
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
  
          {/* RIGHT */}
          <View style={styles.right}>
            <Pressable onPress={onLike}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={32}
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
    size={30}
    color="#fff"
  />
</Pressable>
<Text style={styles.count}>
  {reel.commentsCount}
</Text>

  
            <Pressable onPress={() => shareReel(reel._id)}>
              <Ionicons
                name="paper-plane-outline"
                size={30}
                color="#fff"
              />
            </Pressable>
  
            <Image
              source={{ uri: reel.creator.profileImage }}
              style={styles.disk}
            />
          </View>
        </View>
      </View>
    );
  }
  
  /* ---------------- STYLES ---------------- */
  
  const styles = StyleSheet.create({
    overlay: {
      position: "absolute",
      bottom: 0,
      width,
      flexDirection: "row",
      padding: 12,
    },
    left: {
      flex: 1,
      justifyContent: "flex-end",
    },
    userRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 8,
    },
    username: {
      color: "#fff",
      fontWeight: "600",
    },
    caption: {
      color: "#fff",
      fontSize: 14,
    },
    right: {
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 16,
      paddingBottom: 20,
    },
    count: {
      color: "#fff",
      fontSize: 12,
    },
    disk: {
      width: 44,
      height: 44,
      borderRadius: 22,
      marginTop: 12,
    },
  });
  