import { View, Text, FlatList, Image } from "react-native";

export default function StoryViewersSheet({ viewers }) {
  return (
    <FlatList
      data={viewers}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={{ flexDirection: "row", padding: 12 }}>
          <Image
            source={{ uri: item.profileImage }}
            style={{ width: 36, height: 36, borderRadius: 18 }}
          />
          <Text style={{ marginLeft: 10, fontSize: 15 }}>
            {item.username}
          </Text>
        </View>
      )}
    />
  );
}
