import {
  View,
  FlatList,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  getPostComments,
  createPostComment,
} from "@/services/post.api";

export default function CommentsModal() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getPostComments(postId);
    setComments(data);
  };

  const submit = async () => {
    if (!text.trim()) return;

    const newComment = await createPostComment(
      postId,
      text
    );

    setComments(prev => [newComment, ...prev]);
    setText("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={i => i._id}
        renderItem={({ item }) => (
          <Text style={styles.comment}>
            <Text style={styles.username}>
              {item.user.username}{" "}
            </Text>
            {item.text}
          </Text>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Add a comment…"
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <Pressable onPress={submit}>
          <Text style={styles.post}>Post</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 12,
  },

  comment: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    fontSize: 14,
    color: "#000",
  },

  username: {
    fontWeight: "600",
    color: "#000",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#dbdbdb",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  post: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0095f6",
    marginLeft: 12,
  },
});
