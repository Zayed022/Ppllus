import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function InboxItem({ conversation }: any) {
  const router = useRouter();
  const { user } = useAuth();

  // ⛔ If auth not ready yet
  if (!user || !conversation?.participants?.length) {
    return null;
  }

  // ✅ Safely resolve the other user
  const other = conversation.participants.find(
    (p: any) =>
      p &&
      typeof p === "object" &&
      p._id &&
      p._id.toString() !== user._id.toString()
  );

  // ⛔ Still unresolved → backend issue, don't crash UI
  if (!other) {
    return null;
  }

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        router.push({
          pathname: "/messages/[conversationId]",
          params: { conversationId: conversation._id },
        })
      }
    >
      <Image
        source={{
          uri:
            other.profileImage ||
            `https://ui-avatars.com/api/?name=${other.username || "User"}`,
        }}
        style={styles.avatar}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.username}>
          {other.username || "User"}
        </Text>

        <Text
          numberOfLines={1}
          style={[
            styles.preview,
            !conversation.lastMessageSeen && styles.unseen,
          ]}
        >
          {conversation.lastMessage || "Say hi 👋"}
        </Text>
      </View>
    </Pressable>
  );
}



const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  username: {
    fontWeight: "600",
    fontSize: 14,
  },
  preview: {
    fontSize: 13,
    color: "#666",
  },
  unseen: {
    fontWeight: "700",
    color: "#000",
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
});
