import { View, Text, Image, Pressable, StyleSheet } from "react-native";

const resolveProfileImage = (profile: any) => {
    const uri = profile?.profileImage;
  
    if (typeof uri === "string" && uri.startsWith("http")) {
      return uri.replace(/^http:\/\//, "https://");
    }
  
    if (profile?.username) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        profile.username
      )}`;
    }
  
    // absolute fallback
    return "https://ui-avatars.com/api/?name=User";
  };
  
  

export default function ProfileHeader({
  profile,
  followersCount,
  followingCount,
  isOwnProfile,
  isFollowing,
  onFollow,
}: {
  profile: any;
  followersCount: number;
  followingCount: number;
  isOwnProfile: boolean;
  isFollowing: boolean;
  onFollow: () => void;
}) {
  return (
    <View style={styles.container}>
      {/* Avatar + Stats */}
      <View style={styles.topRow}>
      <Image
  source={{ uri: resolveProfileImage(profile) }}
  style={styles.avatar}
  resizeMode="cover"
  onLoad={() => {}}
/>


        <View style={styles.stats}>
          <Stat label="Posts" value={profile.postsCount ?? 0} />
          <Stat label="Followers" value={followersCount} />
          <Stat label="Following" value={followingCount} />
        </View>
      </View>

      {/* Username & Bio */}
      <Text style={styles.username}>
  {profile?.username || ""}
</Text>

{!!profile?.bio && (
  <Text style={styles.bio}>{profile.bio}</Text>
)}


      {/* Actions */}
      {!isOwnProfile && (
        <View style={styles.actions}>
          <Pressable
            style={[
              styles.followBtn,
              isFollowing && styles.followingBtn,
            ]}
            onPress={onFollow}
          >
            <Text
              style={[
                styles.followText,
                isFollowing && styles.followingText,
              ]}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </Pressable>

          <Pressable style={styles.messageBtn}>
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
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "#fff",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
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
  username: {
    fontWeight: "700",
    marginTop: 12,
    fontSize: 15,
  },
  bio: {
    marginTop: 4,
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
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
  followText: {
    color: "#fff",
    fontWeight: "600",
  },
  followingText: {
    color: "#000",
  },
  messageBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  messageText: {
    fontWeight: "600",
  },
});
