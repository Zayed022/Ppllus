import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

function formatTime(dateString: string) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "Now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;

  return date.toLocaleDateString();
}

export default function InboxItem({ conversation }: any) {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return null;

  const currentUserId =
    user._id?.toString() || user.id?.toString();

  const otherUser = conversation.participants.find(
    (p: any) => p._id.toString() !== currentUserId
  );

  if (!otherUser) return null;

  const lastMessageText =
    conversation?.lastMessage?.text || "Say hi 👋";

  const lastMessageTime =
    conversation?.lastMessage?.createdAt;

  const unreadCount =
    conversation?.unreadCounts?.[currentUserId] || 0;

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        router.push({
          pathname: "/message/[conversationId]",
          params: {
            conversationId: conversation._id,
            otherUserId: otherUser._id,
            username: otherUser.username,
            profileImage: otherUser.profileImage,
          },
        })
      }
    >
      {/* Avatar */}
      <Image
        source={{
          uri:
            otherUser.profileImage ||
            `https://ui-avatars.com/api/?name=${otherUser.username}`,
        }}
        style={styles.avatar}
      />

      {/* Middle Section */}
      <View style={styles.middle}>
        <Text style={styles.username}>
          {otherUser.username}
        </Text>

        <Text
          numberOfLines={1}
          style={[
            styles.preview,
            unreadCount > 0 && styles.unreadText,
          ]}
        >
          {lastMessageText}
        </Text>
      </View>

      {/* Right Section */}
      <View style={styles.right}>
        <Text style={styles.time}>
          {formatTime(lastMessageTime)}
        </Text>

        {unreadCount > 0 && (
          <View style={styles.unreadDot} />
        )}
      </View>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  middle: {
    flex: 1,
  },
  username: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 4,
  },
  preview: {
    fontSize: 14,
    color: "#8e8e93",
  },
  unreadText: {
    fontWeight: "600",
    color: "#000",
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 40,
  },
  time: {
    fontSize: 12,
    color: "#8e8e93",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3797f0",
    marginTop: 6,
  },
});
