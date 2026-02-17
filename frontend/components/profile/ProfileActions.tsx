import { View, Text, Pressable, Share } from "react-native";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";

export default function ProfileActions({
  userId,
  isOwnProfile,
  username,
}: {
  userId: string;
  isOwnProfile: boolean;
  username?: string;
}) {
  const router = useRouter();

  const handleShareProfile = async () => {
    try {
      // App deep link
      const deepLink = Linking.createURL(`/user/${userId}`);

      // Optional public web link (recommended)
      const webLink = `https://onwayz.com/u/${username}`;

      const message = `Check out ${username}'s profile on Onwayz 👇

${webLink}

Open in app:
${deepLink}`;

      await Share.share({
        message,
      });
    } catch (err) {
      console.log("Share error:", err);
    }
  };

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

      <ActionButton
        label="Share profile"
        onPress={handleShareProfile}
      />

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
      <Text style={{ fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );
}
