import { View, Text } from "react-native";

export default function ProfileBio({ user }: any) {
  return (
    <View style={{ paddingHorizontal: 12, marginTop: 8 }}>
      <Text style={{ fontWeight: "700" }}>{user.name || user.username}</Text>
      {user.bio && <Text>{user.bio}</Text>}
    </View>
  );
}
