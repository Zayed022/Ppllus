import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { FeedPost } from "@/types/feed";
import { toggleLikePost } from "@/services/post.api";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";



export default function PostCard({ post }: { post: FeedPost }) {
  const router = useRouter();

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // 🔥 CRITICAL FIX — reset state when post changes
  useEffect(() => {
    setLiked(!!post.isLiked);
    setLikesCount(post.likesCount);
  }, [post._id]);

  const onLike = async () => {
    const prevLiked = liked;
    const prevCount = likesCount;
    const optimistic = !liked;

    setLiked(optimistic);
    setLikesCount(c => (optimistic ? c + 1 : c - 1));

    try {
      const res = await toggleLikePost(post._id);
      setLiked(res.liked);
    } catch {
      setLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() =>
            router.push(`/profile/${post.author._id}`)
          }
          style={styles.userRow}
        >
        <Image source={{ uri: post.author.profileImage }} style={styles.avatar} />
        <Text style={styles.username}>{post.author.username}</Text>
        </Pressable>
      </View>

      <Image source={{ uri: post.media[0].url }} style={styles.media} />

      <View style={styles.actions}>
        <Pressable onPress={onLike} hitSlop={8}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={26}
            color={liked ? "#ed4956" : "#000"}
          />
        </Pressable>

        <Pressable
          onPress={() =>
            router.push({ pathname: "/modal/comments", params: { postId: post._id } })
          }
          hitSlop={8}
        >
          <Ionicons name="chatbubble-outline" size={24} />
        </Pressable>

        <Ionicons name="paper-plane-outline" size={24} />
      </View>

      <Text style={styles.count}>{likesCount} likes</Text>

      {post.caption && (
        <Text style={styles.caption}>
          <Text style={styles.username}>{post.author.username} </Text>
          {post.caption}
        </Text>
      )}

      {post.commentsCount > 0 && (
        <Pressable
          onPress={() =>
            router.push({ pathname: "/modal/comments", params: { postId: post._id } })
          }
        >
          <Text style={styles.viewComments}>
            View all {post.commentsCount} comments
          </Text>
        </Pressable>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  username: {
    fontWeight: "600",
    fontSize: 14,
  },
  media: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#eee",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 14,
  },
  caption: {
    paddingHorizontal: 12,
    fontSize: 13,
  },
  count: {
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 12,
    marginTop: 6,
  },
  viewComments: {
    fontSize: 14,
    color: "#8e8e8e",
    marginHorizontal: 12,
    marginTop: 4,
  },
});
