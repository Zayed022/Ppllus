import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
} from "react-native";
import { useState } from "react";

export default function CommentInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Add a comment…"
        style={styles.input}
        multiline
      />
      <Pressable onPress={submit}>
        <Text style={styles.post}>Post</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    maxHeight: 100,
  },
  post: {
    color: "#0095f6",
    fontWeight: "600",
    marginLeft: 12,
  },
});
