import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Comment } from "@/types/comment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function CommentItem({ comment }: { comment: Comment }) {
  const avatar =
    comment.user.profileImage && comment.user.profileImage.length > 0
      ? comment.user.profileImage
      : `https://ui-avatars.com/api/?name=${comment.user.username}&background=ddd`;

  return (
    <View style={styles.row}>
      {/* Avatar */}
      <Image source={{ uri: avatar }} style={styles.avatar} />

      {/* Content */}
      <View style={styles.body}>
        <Text style={styles.text}>
          <Text style={styles.username}>{comment.user.username} </Text>
          {comment.text}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>
            {dayjs(comment.createdAt).fromNow()}
          </Text>
          <Text style={styles.meta}>Reply</Text>
        </View>
      </View>

      {/* Like */}
      <Pressable hitSlop={10}>
        <Ionicons name="heart-outline" size={16} color="#8e8e8e" />
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
    row: {
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
  
    body: {
      flex: 1,
    },
  
    text: {
      fontSize: 14,
      lineHeight: 18,
      color: "#000",
    },
  
    username: {
      fontWeight: "600",
    },
  
    metaRow: {
      flexDirection: "row",
      gap: 14,
      marginTop: 4,
    },
  
    meta: {
      fontSize: 12,
      color: "#8e8e8e",
    },
  });
  
