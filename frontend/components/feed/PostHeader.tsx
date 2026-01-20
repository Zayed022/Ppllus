import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default function PostHeader({ post }: { post: any }) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image
          source={{ uri: post.author.profileImage }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{post.author.username}</Text>
      </View>

      <Pressable>
        <Feather name="more-horizontal" size={20} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: "#eee",
  },

  username: {
    fontWeight: "600",
    fontSize: 14,
    color: "#000",
  },
});
