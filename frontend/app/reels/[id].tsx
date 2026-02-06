import {
  View,
  Dimensions,
  ActivityIndicator,
  Pressable,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Video, Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

import {
  getReelById,
  toggleLikeReel,
  shareReel,
  recordReelView,
} from "@/services/reel.api";

const { height, width } = Dimensions.get("window");

export default function ReelsPlayer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const videoRef = useRef<Video>(null);

  const [reel, setReel] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const watchStart = useRef<number | null>(null);

  /* ---------------- AUDIO CONFIG (CRITICAL FOR IOS) ---------------- */
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });
  }, []);

  /* ---------------- LOAD REEL ---------------- */
  useEffect(() => {
    getReelById(id).then(data => {
      setReel(data);
      setLiked(!!data.isLiked);
      setLikesCount(data.likesCount);
    });
  }, [id]);

  /* ---------------- PLAY / PAUSE ON FOCUS ---------------- */
  useFocusEffect(
    useCallback(() => {
      if (videoRef.current && ready && !paused) {
        videoRef.current.playAsync();
      }

      return () => {
        videoRef.current?.pauseAsync();
        flushWatchTime();
      };
    }, [ready, paused])
  );

  /* ---------------- WATCH TIME TRACKING ---------------- */
  const onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) return;

    if (status.isPlaying && watchStart.current === null) {
      watchStart.current = Date.now();
    }

    if (!status.isPlaying && watchStart.current) {
      flushWatchTime();
    }
  };

  const flushWatchTime = () => {
    if (!watchStart.current) return;

    const duration =
      (Date.now() - watchStart.current) / 1000;

    recordReelView(reel._id, duration);
    watchStart.current = null;
  };

  /* ---------------- TAP PLAY / PAUSE ---------------- */
  const togglePlay = async () => {
    if (!videoRef.current) return;

    const status = await videoRef.current.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
      setPaused(true);
    } else {
      await videoRef.current.playAsync();
      setPaused(false);
    }
  };

  /* ---------------- LONG PRESS MUTE ---------------- */
  const toggleMute = async () => {
    if (!videoRef.current) return;

    await videoRef.current.setIsMutedAsync(!muted);
    setMuted(m => !m);
  };

  /* ---------------- LIKE (OPTIMISTIC) ---------------- */
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

  /* ---------------- SHARE ---------------- */
  const onShare = () => {
    shareReel(reel._id);
  };

  if (!reel) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* VIDEO */}
      <Pressable
        style={styles.videoPressable}
        onPress={togglePlay}
        onLongPress={toggleMute}
      >
        <Video
          ref={videoRef}
          source={{ uri: reel.videoUrl }}
          posterSource={{ uri: reel.thumbnailUrl }}
          usePoster
          style={styles.video}
          resizeMode="cover"
          isLooping
          shouldPlay={false}
          useNativeControls={false}
          isMuted={muted}
          progressUpdateIntervalMillis={250}
          onReadyForDisplay={() => setReady(true)}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          bufferOptions={{
            minBufferMs: 500,
            maxBufferMs: 3000,
            bufferForPlaybackMs: 500,
            bufferForPlaybackAfterRebufferMs: 1000,
          }}
        />
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
            <Text style={styles.follow}>Follow</Text>
          </Pressable>

          {reel.caption && (
            <Text style={styles.caption} numberOfLines={2}>
              {reel.caption}
            </Text>
          )}

          <Text style={styles.audio}>Original audio</Text>
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

          <Pressable onPress={onShare}>
            <Ionicons
              name="paper-plane-outline"
              size={30}
              color="#fff"
            />
          </Pressable>

          <Ionicons
            name="ellipsis-vertical"
            size={22}
            color="#fff"
          />

          <Image
            source={{ uri: reel.creator.profileImage }}
            style={styles.disk}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  loader: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  videoPressable: { width, height },
  video: { width, height },
  overlay: {
    position: "absolute",
    bottom: 0,
    width,
    flexDirection: "row",
    padding: 12,
  },
  left: { flex: 1, justifyContent: "flex-end" },
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
    marginRight: 10,
  },
  follow: { color: "#fff", fontWeight: "600" },
  caption: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 6,
  },
  audio: { color: "#ddd", fontSize: 12 },
  right: {
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 16,
    paddingBottom: 20,
  },
  count: { color: "#fff", fontSize: 12 },
  disk: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginTop: 12,
  },
});
