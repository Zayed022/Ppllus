import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { useState } from "react";

export default function CommentInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Add a comment…"
        value={text}
        onChangeText={setText}
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
    padding: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
  },
  post: {
    color: "#0095f6",
    fontWeight: "600",
    marginLeft: 12,
  },
});
