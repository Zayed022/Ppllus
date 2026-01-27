import { View, Text, Pressable, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { createReel } from "@/services/reel.api";
import { router } from "expo-router";

export default function CreateReel() {
  const [video, setVideo] = useState<any>(null);
  const [thumbnail, setThumbnail] = useState<any>(null);

  const pickVideo = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!res.canceled) {
      setVideo(res.assets[0]);
    }
  };

  const pickThumbnail = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!res.canceled) {
      setThumbnail(res.assets[0]);
    }
  };

  const upload = async () => {
    if (!video || !thumbnail) {
      alert("Video and thumbnail are required");
      return;
    }

    const form = new FormData();

    form.append("videoUrl", {
      uri: video.uri,
      name: "reel.mp4",
      type: "video/mp4",
    } as any);

    form.append("thumbnailUrl", {
      uri: thumbnail.uri,
      name: "thumb.jpg",
      type: "image/jpeg",
    } as any);

    form.append("duration", String(video.duration ?? 0));
    form.append("categories", JSON.stringify([]));
    form.append("city", "");

    await createReel(form);
    router.replace("/(tabs)/explore");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000", padding: 24 }}>
      {!video && (
        <Pressable onPress={pickVideo}>
          <Text style={{ color: "#fff" }}>Select video</Text>
        </Pressable>
      )}

      {video && !thumbnail && (
        <Pressable onPress={pickThumbnail}>
          <Text style={{ color: "#fff" }}>Select thumbnail</Text>
        </Pressable>
      )}

      {video && thumbnail && (
        <Pressable onPress={upload}>
          <Text style={{ color: "#fff" }}>Share Reel</Text>
        </Pressable>
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
    marginBottom: 16,
  },
  share: {
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
