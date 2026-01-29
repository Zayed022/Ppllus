import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function ProfileActions({
  userId,
  isOwnProfile,
}: {
  userId: string;
  isOwnProfile: boolean;
}) {
  const router = useRouter();

  return (
    <View style={{ flexDirection: "row", paddingHorizontal: 12, gap: 8 }}>
      <ActionButton
        label={isOwnProfile ? "Edit profile" : "Follow"}
        onPress={() => {
          if (isOwnProfile) {
            router.push({
              pathname: "/modal/edit-profile",
              params: { userId },
            });
          }
        }}
      />

      <ActionButton label="Share profile" />
      <ActionButton label="Add person" />
    </View>
  );
}


function ActionButton({ label, onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 14,
        marginBottom: 14,
      }}
    >
      {label && <Text style={{ fontWeight: "600" }}>{label}</Text>}
    </Pressable>
  );
}
