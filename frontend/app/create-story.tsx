import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";

export default function CreateStory() {
  const router = useRouter();
  const [media, setMedia] = useState<{
    uri: string;
    type: "IMAGE" | "VIDEO";
  } | null>(null);

  const pickMedia = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (res.canceled) return;

    const asset = res.assets[0];

    const selected = {
      uri: asset.uri,
      type: asset.type === "video" ? "VIDEO" : "IMAGE",
    };

    setMedia(selected);

    // 👉 MOVE TO DETAILS SCREEN
    router.push({
      pathname: "/create-story/details",
      params: selected,
    });
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={pickMedia} style={styles.pick}>
        <Text style={styles.pickText}>Select Photo or Video</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  pick: {
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
  },
  pickText: {
    color: "#fff",
    fontSize: 16,
  },
});
