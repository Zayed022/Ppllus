import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProfileMenuModal() {
  const router = useRouter();

  const Item = ({ icon, label }: any) => (
    <Pressable style={styles.item}>
      <Ionicons name={icon} size={22} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Item icon="bookmark-outline" label="Saved" />
      <Item icon="archive-outline" label="Archive" />
      <Item icon="settings-outline" label="Settings" />
      <Item icon="hand-left-outline" label="Blocked" />
      <Item icon="log-out-outline" label="Log out" />

      <Pressable onPress={() => router.back()}>
        <Text style={styles.cancel}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 20
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  label: {
    marginLeft: 16,
    fontSize: 16,
  },
  cancel: {
    textAlign: "center",
    color: "#0095f6",
    marginTop: 12,
    fontSize: 16,
  },
});
