import { View, Text, Image, StyleSheet } from "react-native";

export default function CommentItem({ comment }: { comment: any }) {
  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Image
        source={{ uri: comment.user?.profileImage }}
        style={styles.avatar}
      />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.textRow}>
          <Text style={styles.username}>
            {comment.user?.username}
          </Text>

          <Text style={styles.commentText}>
            {" "}
            {comment.text}
          </Text>
        </View>

        {/* Meta */}
        <View style={styles.metaRow}>
          <Text style={styles.time}>a few seconds ago</Text>
          <Text style={styles.reply}>Reply</Text>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "flex-start",
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: "#eee",
  },

  content: {
    flex: 1,              // 🔴 CRITICAL
  },

  textRow: {
    flexDirection: "row",
    flexWrap: "wrap",     // 🔴 CRITICAL
  },

  username: {
    fontWeight: "600",
    fontSize: 14,
    color: "#000",
  },

  commentText: {
    fontSize: 14,
    color: "#000",
    flexShrink: 1,        // 🔴 CRITICAL
  },

  metaRow: {
    flexDirection: "row",
    marginTop: 4,
  },

  time: {
    fontSize: 12,
    color: "#8e8e8e",
    marginRight: 16,
  },

  reply: {
    fontSize: 12,
    color: "#8e8e8e",
    fontWeight: "500",
  },
});
