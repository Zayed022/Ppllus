import { View, Text, Pressable } from "react-native";

export default function ProfileActions({ isOwnProfile }: any) {
  return (
    <View style={{ flexDirection: "row", paddingHorizontal: 12, gap: 8 }}>
      <ActionButton label={isOwnProfile ? "Edit profile" : "Follow"} />
      <ActionButton label="Share profile" />
      <ActionButton icon="person-add-outline" />
    </View>
  );
}

function ActionButton({ label, icon }: any) {
  return (
    <Pressable
      style={{
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 14,
        marginBottom: 14
      }}
    >
      <Text style={{ fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );
}
