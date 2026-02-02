import {
    View,
    Animated,
    PanResponder,
    StyleSheet,
  } from "react-native";
  import { useLocalSearchParams, useRouter } from "expo-router";
  import { useEffect, useRef, useState } from "react";
  import { getPostById } from "@/services/post.api";
import PostCard from "@/components/home/PostCard";
  
  
  export default function PostViewer() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
  
    const [post, setPost] = useState<any>(null);
  
    /* ---------------- LOAD POST ---------------- */
    useEffect(() => {
      loadPost();
    }, [id]);
  
    const loadPost = async () => {
      const data = await getPostById(id);
      setPost(data);
    };
  
    /* ---------------- SWIPE DOWN TO DISMISS ---------------- */
    const translateY = useRef(new Animated.Value(0)).current;
  
    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dy) > 8,
  
        onPanResponderMove: (_, g) => {
          if (g.dy > 0) {
            translateY.setValue(g.dy);
          }
        },
  
        onPanResponderRelease: (_, g) => {
          if (g.dy > 120) {
            router.back(); // Instagram dismiss threshold
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      })
    ).current;
  
    if (!post) return null;
  
    return (
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY }] },
        ]}
        {...panResponder.panHandlers}
      >
        {/* 🔥 REUSE POSTCARD — DO NOT DUPLICATE UI */}
        <PostCard post={post} />
      </Animated.View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
  });
  