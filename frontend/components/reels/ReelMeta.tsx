import { View, Text, Image, StyleSheet } from "react-native";

export default function ReelMeta({ reel }: { reel: any }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image
          source={{ uri: reel.creator.profileImage }}
          style={styles.avatar}
        />
        <Text style={styles.username}>
          {reel.creator.username}
        </Text>
      </View>

      <Text style={styles.caption}>
        {reel.categories?.join(" · ")} • {reel.city}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    left: 12,
    right: 80,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 8,
  },
  username: {
    color: "#fff",
    fontWeight: "600",
  },
  caption: {
    color: "#fff",
    fontSize: 13,
  },
});
