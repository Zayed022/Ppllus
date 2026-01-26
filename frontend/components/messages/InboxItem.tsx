import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function InboxItem({ conversation }: any) {
  const router = useRouter();
  const { user } = useAuth();
  

  if (!user) return null;

  const otherUserId = conversation.participants.find(
    (id: string) => id !== user._id
  );

  if (!otherUserId) return null;

  const lastMessageText =
    conversation?.lastMessage?.text || "Say hi 👋";

  const unreadCount =
    conversation?.unreadCounts?.[user._id] || 0;

  return (
    <Pressable
  style={styles.container}
  onPress={() =>
    router.push(
      `/message/${conversation._id}?otherUserId=${otherUserId}`
    )
  }
  
>

      <Image
        source={{
          uri: `https://ui-avatars.com/api/?name=User`,
        }}
        style={styles.avatar}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.username}>User</Text>

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
