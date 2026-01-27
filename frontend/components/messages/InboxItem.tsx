import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function InboxItem({ conversation }: any) {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return null;

  // ✅ FIX: participants are OBJECTS, not IDs
  const otherUser = conversation.participants.find(
    (p: any) => p._id !== user.id
  );

  if (!otherUser) return null;

  const lastMessageText =
    conversation?.lastMessage?.text || "Say hi 👋";

    const unreadCount =
    conversation?.unreadCounts?.[user.id] || 0;

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        router.push(
          `/message/${conversation._id}?otherUserId=${otherUser._id}`
        )
      }
    >
      <Image
        source={{
          uri:
            otherUser.profileImage ||
            `https://ui-avatars.com/api/?name=${otherUser.username}`,
        }}
        style={styles.avatar}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.username}>
          {otherUser.username}
        </Text>

        <Text
          numberOfLines={1}
          style={[
            styles.preview,
            unreadCount > 0 && styles.unseen,
          ]}
        >
          {lastMessageText}
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
