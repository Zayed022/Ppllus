import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getFollowers, getFollowing } from "@/services/follow.api";

interface Props {
  userId: string;
  profileImage?: string | null;
}

export default function ProfileStats({ userId }: Props) {
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    const [followersRes, followingRes] = await Promise.all([
      getFollowers(userId),
      getFollowing(userId),
    ]);

    setFollowers(followersRes.length);
    setFollowing(followingRes.length);
  };

  return (
    <View style={styles.container}>
      <Stat label="Posts" value={0} />
      <Stat label="Followers" value={followers} />
      <Stat label="Following" value={following} />
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
  },
  stat: {
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  label: {
    fontSize: 13,
    color: "#666",
  },
});
