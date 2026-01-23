import {
    View,
    Text,
    Image,
    Pressable,
    StyleSheet,
  } from "react-native";
  import { useState } from "react";
  import { FeedPost } from "@/types/feed";
  import { toggleLikePost } from "@/services/post.api";
  import { useRouter } from "expo-router";
  
  export default function PostCard({ post }: { post: FeedPost }) {
    const router = useRouter();
  
    const [liked, setLiked] = useState(post.isLiked ?? false);
    const [likesCount, setLikesCount] = useState(post.likesCount);
  
    const onLike = async () => {
      // 1️⃣ Optimistic update
      setLiked(prev => !prev);
      setLikesCount(c => (liked ? c - 1 : c + 1));
  
      try {
        const res = await toggleLikePost(post._id);
  
        // 2️⃣ Reconcile with backend
        setLiked(res.liked);
      } catch {
        // rollback
        setLiked(liked);
        setLikesCount(post.likesCount);
      }
    };
  
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: post.author.profileImage }}
            style={styles.avatar}
          />
          <Text style={styles.username}>
            {post.author.username}
          </Text>
        </View>
  
        {/* Media */}
        <Image
          source={{ uri: post.media[0].url }}
          style={styles.media}
        />
  
        {/* Actions */}
        <View style={styles.actions}>
          <Pressable onPress={onLike}>
            <Text style={{ fontSize: 22 }}>
              {liked ? "❤️" : "🤍"}
            </Text>
          </Pressable>
  
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/modal",
                params: { postId: post._id },
              })
            }
          >
            <Text style={{ fontSize: 22 }}>💬</Text>
          </Pressable>
        </View>
  
        {/* Counts */}
        <Text style={styles.count}>
          {likesCount} likes
        </Text>
  
        {/* Caption */}
        {post.caption && (
          <Text style={styles.caption}>
            <Text style={styles.username}>
              {post.author.username}{" "}
            </Text>
            {post.caption}
          </Text>
        )}
  
        {/* View comments */}
        {post.commentsCount > 0 && (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/modal",
                params: { postId: post._id },
              })
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
        color: "#000",
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
  