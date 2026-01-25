import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Props {
  username: string;
  profileImage: string | null;
}

export default function ProfileHeader({ username, profileImage }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={{ width: 24 }} /> {/* spacer */}

        <Text style={styles.username}>{username}</Text>

        <View style={styles.topActions}>
          <Ionicons name="add-outline" size={24} />
          <Pressable onPress={() => router.push("/modal/profile-menu")}>
            <Ionicons
              name="menu-outline"
              size={24}
              style={{ marginLeft: 16 }}
            />
          </Pressable>
        </View>
      </View>

      {/* Avatar + Stats */}
      <View style={styles.row}>
        {/* Avatar */}
        <View>
          <Image
            source={{ uri: profileImage ?? undefined }}
            style={styles.avatar}
          />
          <View style={styles.addBadge}>
            <Ionicons name="add" size={14} color="#fff" />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <Stat label="Posts" value={0} />
          <Stat label="Followers" value={0} />
          <Stat label="Following" value={2} />
        </View>
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    marginTop: 14
  },

  /* TOP BAR */
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  username: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },

  topActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* AVATAR + STATS */
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },

  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#eee",
  },

  addBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#0095f6",
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  stats: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: 20,
  },

  stat: {
    alignItems: "center",
  },

  statValue: {
    fontSize: 16,
    fontWeight: "600",
  },

  statLabel: {
    fontSize: 13,
    color: "#666",
  },
});
