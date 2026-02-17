import { View, Text, Image, Pressable, StyleSheet, ActivityIndicator } from "react-native";

const resolveProfileImage = (user: any) => {
  const uri = user?.profileImage;
  if (typeof uri === "string" && uri.startsWith("http")) {
    return uri.replace(/^http:\/\//, "https://");
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.username || "User"
  )}`;
};

export default function ProfileHeader({
  user,
  counts,
  isOwnProfile,
  isFollowing,
  isRequested,
  onFollow,
  onMessage,
  loadingFollow,
}: {
  user: any;
  counts: { posts: number; followers: number; following: number };
  isOwnProfile: boolean;
  isFollowing: boolean;
  isRequested: boolean;
  onFollow: () => void;
  onMessage: () => void;
  loadingFollow: boolean;
}) {
  const getButtonLabel = () => {
    if (isFollowing) return "Following";
    if (isRequested) return "Requested";
    return "Follow";
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Image
          source={{ uri: resolveProfileImage(user) }}
          style={styles.avatar}
        />

        <View style={styles.stats}>
          <Stat label="Posts" value={counts.posts} />
          <Stat label="Followers" value={counts.followers} />
          <Stat label="Following" value={counts.following} />
        </View>
      </View>

      <Text style={styles.username}>{user.username}</Text>
      {!!user.bio && <Text style={styles.bio}>{user.bio}</Text>}

      {!isOwnProfile && (
        <View style={styles.actions}>
          <Pressable
            disabled={loadingFollow}
            style={[
              styles.followBtn,
              (isFollowing || isRequested) && styles.followingBtn,
            ]}
            onPress={onFollow}
          >
            {loadingFollow ? (
              <ActivityIndicator size="small" color="#999" />
            ) : (
              <Text
                style={[
                  styles.followText,
                  (isFollowing || isRequested) && styles.followingText,
                ]}
              >
                {getButtonLabel()}
              </Text>
            )}
          </Pressable>

          <Pressable style={styles.messageBtn} onPress={onMessage}>
            <Text style={styles.messageText}>Message</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const Stat = ({ label, value }: { label: string; value: number }) => (
  <View style={{ alignItems: "center" }}>
    <Text style={{ fontWeight: "700", fontSize: 16 }}>{value}</Text>
    <Text style={{ fontSize: 12, color: "#666" }}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  topRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#eee",
  },
  stats: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  username: { fontWeight: "700", marginTop: 12, fontSize: 15 },
  bio: { marginTop: 4, color: "#333" },
  actions: { flexDirection: "row", gap: 8, marginTop: 14 },

  followBtn: {
    flex: 1,
    backgroundColor: "#0095f6",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  followingBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  followText: { color: "#fff", fontWeight: "600" },
  followingText: { color: "#000" },

  messageBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  messageText: { fontWeight: "600" },
});
