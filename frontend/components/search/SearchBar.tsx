import { View, TextInput, Pressable, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.container}>
      <Feather name="search" size={18} color="#888" />

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search"
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {value.length > 0 && (
        <Pressable onPress={() => onChange("")}>
          <Feather name="x" size={18} color="#888" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    margin: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 40,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
  },
});
