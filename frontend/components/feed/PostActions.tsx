import { View, StyleSheet, Pressable } from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default function PostActions({ postId }: { postId: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Pressable>
          <Feather name="heart" size={24} />
        </Pressable>

        <Pressable>
          <Feather name="message-circle" size={24} />
        </Pressable>

        <Pressable>
          <Feather name="send" size={24} />
        </Pressable>
      </View>

      <Pressable>
        <Feather name="bookmark" size={24} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  left: {
    flexDirection: "row",
    gap: 16,
  },
});
