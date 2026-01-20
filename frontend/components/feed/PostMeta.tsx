import { View, Text, StyleSheet } from "react-native";

export default function PostMeta({ post }: { post: any }) {
  return (
    <View style={styles.container}>
      <Text style={styles.likes}>
        {post.likesCount} likes
      </Text>

      {post.caption && (
        <Text style={styles.caption}>
          <Text style={styles.username}>
            {post.author.username}{" "}
          </Text>
          {post.caption}
        </Text>
      )}

      {post.commentsCount > 0 && (
        <Text style={styles.comments}>
          View all {post.commentsCount} comments
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },

  likes: {
    fontWeight: "600",
    marginBottom: 4,
  },

  caption: {
    lineHeight: 18,
  },

  username: {
    fontWeight: "600",
  },

  comments: {
    color: "#666",
    marginTop: 4,
  },
});
