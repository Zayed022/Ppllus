import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function UserSearchItem({ user }: any) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push(`/profile/${user._id}`)}
    >
      <Image
        source={{
          uri:
            user.profileImage ||
            `https://ui-avatars.com/api/?name=${user.username}`,
        }}
        style={styles.avatar}
      />

      <View>
        <Text style={styles.username}>{user.username}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  username: {
    fontSize: 15,
    fontWeight: "500",
  },
});
