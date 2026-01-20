import { View, Text, Pressable, FlatList } from "react-native";

export default function HighlightPicker({ highlights, onSelect }) {
  return (
    <FlatList
      data={highlights}
      keyExtractor={(h) => h._id}
      renderItem={({ item }) => (
        <Pressable
          style={{ padding: 14 }}
          onPress={() => onSelect(item._id)}
        >
          <Text style={{ fontSize: 16 }}>{item.name}</Text>
        </Pressable>
      )}
    />
  );
}
