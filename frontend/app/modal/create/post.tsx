import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { createPost } from "@/services/post.api";
import { router } from "expo-router";

export default function CreatePost() {
  const [media, setMedia] = useState<any>(null);

  const pickMedia = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!res.canceled) {
      setMedia(res.assets[0]);
    }
  };

  const upload = async () => {
    if (!media) {
      alert("Please select media first");
      return;
    }

    const isVideo = media.type === "video";

    const form = new FormData();
    form.append("media", {
      uri: media.uri,
      name: isVideo ? "post.mp4" : "post.jpg",
      type: isVideo ? "video/mp4" : "image/jpeg",
    } as any);

    await createPost(form);
    router.replace("/(tabs)/feed");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {!media ? (
        <Pressable onPress={pickMedia}>
          <Text style={{ color: "#fff", marginTop: 40, textAlign: "center" }}>
            Select media
          </Text>
        </Pressable>
      ) : (
        <>
          <Image source={{ uri: media.uri }} style={{ flex: 1 }} />
          <Pressable onPress={upload}>
            <Text style={{ color: "#fff", padding: 16, textAlign: "center" }}>
              Share
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  pick: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  preview: {
    width: "100%",
    height: 300,
    marginBottom: 12,
  },
  input: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  share: {
    marginTop: 16,
    backgroundColor: "#3797f0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  shareText: {
    color: "#fff",
    fontWeight: "700",
  },
});
