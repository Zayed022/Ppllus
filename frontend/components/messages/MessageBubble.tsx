import { View, Text, StyleSheet } from "react-native";

export default function MessageBubble({ message }: any) {
  const mine = message.fromMe;

  return (
    <View
      style={[
        styles.container,
        mine ? styles.mine : styles.theirs,
      ]}
    >
      <Text style={styles.text}>{message.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 16,
    maxWidth: "75%",
  },
  mine: {
    alignSelf: "flex-end",
    backgroundColor: "#3797f0",
  },
  theirs: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
  },
  text: {
    color: "#000",
  },
});
