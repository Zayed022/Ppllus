import { View, Text, StyleSheet, Image } from "react-native";
import { Video } from "expo-av";
import dayjs from "dayjs";

export default function MessageBubble({ message }: any) {
  if (!message) return null;

  const isMine = message?.fromMe === true;

  const time = message?.createdAt
    ? dayjs(message.createdAt).format("hh:mm A")
    : "";

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
        {/* 🔹 TEXT MESSAGE */}
        {message?.body ? (
          <Text
            style={[
              styles.text,
              isMine ? styles.textMine : styles.textTheirs,
            ]}
          >
            {message.body}
          </Text>
        ) : null}

        {/* 🔹 IMAGE */}
        {message?.media?.url &&
          message?.media?.type === "IMAGE" && (
            <Image
              source={{ uri: message.media.url }}
              style={styles.media}
              resizeMode="cover"
            />
          )}

        {/* 🔹 VIDEO */}
        {message?.media?.url &&
          message?.media?.type === "VIDEO" && (
            <Video
              source={{ uri: message.media.url }}
              style={styles.media}
              useNativeControls
              resizeMode="contain"
            />
          )}

        {/* 🔹 TIME */}
        <Text
          style={[
            styles.time,
            isMine ? styles.timeMine : styles.timeTheirs,
          ]}
        >
          {time}
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
    padding: 8,
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
    marginBottom: 4,
  },
  textMine: {
    color: "#fff",
  },
  textTheirs: {
    color: "#000",
  },
  media: {
    width: 220,
    height: 220,
    borderRadius: 12,
    marginTop: 6,
  },
  time: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  timeMine: {
    color: "rgba(255,255,255,0.8)",
  },
  timeTheirs: {
    color: "#555",
  },
});
