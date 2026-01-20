import {
    View,
    StyleSheet,
    Pressable,
    Dimensions,
    Image,
    TextInput,
    Text,
    Keyboard,
    Modal,
    FlatList,
  } from "react-native";
  import { useLocalSearchParams, useRouter } from "expo-router";
  import { useEffect, useRef, useState } from "react";
  import { Video } from "expo-av";
  import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
  } from "react-native-gesture-handler";
  
  import { getUserStories, markStoryViewed } from "@/services/story.api";
  import api from "@/services/api";
  import { Story } from "@/types/story";
  import StoryProgress from "@/components/StoryProgress";
  import * as Haptics from "expo-haptics";
  import { storyEvents } from "@/utils/storyEvents";
  
  const { width, height } = Dimensions.get("window");
  const IMAGE_DURATION = 5000;
  const EMOJIS = ["❤️", "😂", "🔥", "👏", "😮"];
  
  export default function StoryViewer() {
    const { userId, isSelf } = useLocalSearchParams<{
      userId: string;
      isSelf?: string;
    }>();
  
    const router = useRouter();
    const isOwner = isSelf === "true";
  
    const [stories, setStories] = useState<Story[]>([]);
    const [index, setIndex] = useState(0);
    const [imageRatio, setImageRatio] = useState<number | null>(null);
    const [reply, setReply] = useState("");
  
    const [viewers, setViewers] = useState<any[]>([]);
    const [showViewers, setShowViewers] = useState(false);
  
    const [highlights, setHighlights] = useState<any[]>([]);
    const [showHighlights, setShowHighlights] = useState(false);
  
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const pausedRef = useRef(false);
    const videoRef = useRef<Video>(null);
  
    /* ==========================
       LOAD STORIES
    ========================== */
    useEffect(() => {
      loadStories();
      return clearTimer;
    }, []);
  
    const loadStories = async () => {
      const res = await getUserStories(userId);
      setStories(res || []);
    };
  
    /* ==========================
       STORY CHANGE
    ========================== */
    useEffect(() => {
      const story = stories[index];
      if (!story) return;
  
      markStoryViewed(story._id);
  
      // 🔥 Emit ONLY for non-self stories
      if (!isOwner) {
        storyEvents.emitStorySeen({
          userId,
          storyId: story._id,
        });
      }
  
      prepareImageRatio(story);
      startTimer(story);
  
      return clearTimer;
    }, [index, stories]);
  
    /* ==========================
       IMAGE ASPECT RATIO
    ========================== */
    const prepareImageRatio = (story: Story) => {
      if (story.mediaType !== "IMAGE") {
        setImageRatio(null);
        return;
      }
  
      Image.getSize(
        story.mediaUrl,
        (w, h) => setImageRatio(w / h),
        () => setImageRatio(null)
      );
    };
  
    /* ==========================
       TIMER CONTROL
    ========================== */
    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  
    const startTimer = (story: Story) => {
      if (pausedRef.current) return;
  
      clearTimer();
  
      const duration =
        story.mediaType === "VIDEO"
          ? (story.duration ?? 5) * 1000
          : IMAGE_DURATION;
  
      timerRef.current = setTimeout(next, duration);
    };
  
    /* ==========================
       PAUSE / RESUME
    ========================== */
    const pause = async () => {
      if (pausedRef.current) return;
      pausedRef.current = true;
      clearTimer();
      await videoRef.current?.pauseAsync();
    };
  
    const resume = async () => {
      if (!pausedRef.current) return;
      pausedRef.current = false;
  
      const story = stories[index];
      if (!story) return;
  
      startTimer(story);
      await videoRef.current?.playAsync();
    };
  
    /* ==========================
       NAVIGATION
    ========================== */
    const next = () => {
      if (index < stories.length - 1) {
        setIndex(i => i + 1);
      } else {
        router.back();
      }
    };
  
    const prev = () => {
      if (index > 0) {
        setIndex(i => i - 1);
      }
    };
  
    /* ==========================
       REACTIONS / REPLIES
    ========================== */
    const reactToStory = (emoji: string) => {
      const story = stories[index];
      if (!story) return;
  
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      api.post(`/story/${story._id}/react`, { emoji });
    };
  
    const sendReply = async () => {
      const story = stories[index];
      if (!story || !reply.trim()) return;
  
      await api.post(`/story/${story._id}/react`, { emoji: reply });
      setReply("");
      Keyboard.dismiss();
      resume();
    };
  
    /* ==========================
       OWNER ACTIONS
    ========================== */
    const deleteStory = async () => {
      const story = stories[index];
      await api.delete(`/story/${story._id}`);
  
      setStories(prev => prev.filter(s => s._id !== story._id));
      setIndex(i => Math.max(0, i - 1));
    };
  
    const loadViewers = async () => {
      if (!isOwner) return;
  
      const story = stories[index];
      const res = await api.get(`/story/${story._id}/viewers`);
      setViewers(res.data.viewers || []);
      setShowViewers(true);
    };
  
    const loadHighlights = async () => {
      if (!isOwner) return;
  
      const res = await api.get(`/story/highlights/${userId}`);
      setHighlights(res.data || []);
      setShowHighlights(true);
    };
  
    const addToHighlight = async (highlightId: string) => {
      const story = stories[index];
      await api.post(`/story/highlights/${highlightId}/${story._id}`);
      setShowHighlights(false);
    };
  
    /* ==========================
       GESTURE HANDLER
    ========================== */
    const onPanGesture = (e: PanGestureHandlerGestureEvent) => {
      if (Keyboard.isVisible()) return;
  
      if (e.nativeEvent.translationY > 140) {
        router.back();
      }
  
      if (isOwner && e.nativeEvent.translationY < -140) {
        loadViewers();
      }
    };
  
    /* ==========================
       RENDER
    ========================== */
    const story = stories[index];
    if (!story) return null;
  
    const isPortrait = imageRatio !== null && imageRatio < 0.9;
  
    return (
      <PanGestureHandler onGestureEvent={onPanGesture}>
        <View style={styles.container}>
          <StoryProgress
            total={stories.length}
            current={index}
            paused={pausedRef.current}
          />
  
          <Pressable
            style={styles.mediaWrapper}
            onLongPress={pause}
            onPressOut={resume}
            onPress={next}
          >
            {story.mediaType === "IMAGE" ? (
              <Image
                source={{ uri: story.mediaUrl }}
                style={styles.media}
                resizeMode={isPortrait ? "contain" : "cover"}
              />
            ) : (
              <Video
                ref={videoRef}
                source={{ uri: story.mediaUrl }}
                style={styles.media}
                resizeMode="cover"
                shouldPlay
              />
            )}
          </Pressable>
  
          <Pressable style={styles.leftTap} onPress={prev} />
          <Pressable style={styles.rightTap} onPress={next} />
  
          <View style={styles.emojiRow}>
            {EMOJIS.map(e => (
              <Pressable key={e} onPress={() => reactToStory(e)}>
                <Text style={styles.emoji}>{e}</Text>
              </Pressable>
            ))}
          </View>
  
          <View style={styles.replyBox}>
            <TextInput
              value={reply}
              onChangeText={setReply}
              placeholder="Send message"
              placeholderTextColor="#ccc"
              style={styles.replyInput}
              onFocus={pause}
              onSubmitEditing={sendReply}
            />
          </View>
        </View>
      </PanGestureHandler>
    );
  }
  
  /* ==========================
     STYLES
  ========================== */
  const styles = StyleSheet.create({
    container: { width, height, backgroundColor: "#000" },
    mediaWrapper: { flex: 1 },
    media: { width, height },
    leftTap: { position: "absolute", left: 0, top: 0, width: "50%", height: "100%" },
    rightTap: { position: "absolute", right: 0, top: 0, width: "50%", height: "100%" },
    emojiRow: { position: "absolute", bottom: 90, flexDirection: "row", gap: 18, alignSelf: "center" },
    emoji: { fontSize: 28 },
    replyBox: {
      position: "absolute",
      bottom: 20,
      left: 12,
      right: 12,
      backgroundColor: "rgba(0,0,0,0.6)",
      borderRadius: 30,
      paddingHorizontal: 16,
    },
    replyInput: { height: 44, color: "#fff" },
  });
  