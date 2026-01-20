import { View, Text, Image, FlatList } from "react-native";

export default function StoryReactionsModal({ reactions }) {
  return (
    <FlatList
      data={reactions}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={{ flexDirection: "row", padding: 12 }}>
          <Image
            source={{ uri: item.user.profileImage }}
            style={{ width: 36, height: 36, borderRadius: 18 }}
          />
          <Text style={{ marginLeft: 10 }}>
            {item.user.username} {item.emoji}
          </Text>
        </View>
      )}
    />
  );
}
