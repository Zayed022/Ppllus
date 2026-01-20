import { View, StyleSheet } from "react-native";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import PostActions from "./PostActions";
import PostMeta from "./PostMeta";


export default function PostCard({ post }: { post: any }) {
  return (
    <View style={styles.container}>
      <PostHeader post={post} />
      <PostMedia media={post.media} />
      <PostActions postId={post._id} />
      <PostMeta post={post} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 12,
  },
});
