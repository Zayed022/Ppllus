import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CreateSelector() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.option}
        onPress={() => router.push("/modal/create/post")}
      >
        <Ionicons name="image-outline" size={26} />
        <Text style={styles.text}>Post</Text>
      </Pressable>

      <Pressable
        style={styles.option}
        onPress={() => router.push("/modal/create/reel")}
      >
        <Ionicons name="videocam-outline" size={26} />
        <Text style={styles.text}>Reel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginLeft: 12,
    fontWeight: "600",
  },
});
