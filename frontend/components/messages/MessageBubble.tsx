import { View, Text, StyleSheet } from "react-native";

export default function MessageBubble({ message }: any) {
  if (!message) return null;

  const isMine = message?.fromMe === true;

  return (
    <View
      style={[
        styles.row,
        isMine ? styles.rowMine : styles.rowTheirs,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isMine ? styles.bubbleMine : styles.bubbleTheirs,
        ]}
      >
        <Text
          style={[
            styles.text,
            isMine ? styles.textMine : styles.textTheirs,
          ]}
        >
          {message?.body || ""}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    marginVertical: 4,
  },
  rowMine: {
    alignItems: "flex-end",
  },
  rowTheirs: {
    alignItems: "flex-start",
  },
  bubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    maxWidth: "75%",
  },
  bubbleMine: {
    backgroundColor: "#3797f0",
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: "#eee",
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 15,
  },
  textMine: {
    color: "#fff",
  },
  textTheirs: {
    color: "#000",
  },
});
