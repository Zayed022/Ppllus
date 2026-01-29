import { View, TextInput, Pressable, Text } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { updateBasicProfile } from "@/services/profile.api";

export default function EditBioModal() {
  const router = useRouter();
  const [bio, setBio] = useState("");

  const save = async () => {
    await updateBasicProfile({ bio });
    router.back();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Bio"
        multiline
        value={bio}
        onChangeText={setBio}
        style={{ fontSize: 16 }}
      />

      <Pressable onPress={save} style={{ marginTop: 20 }}>
        <Text style={{ color: "#0095f6", fontWeight: "600" }}>
          Save
        </Text>
      </Pressable>
    </View>
  );
}
