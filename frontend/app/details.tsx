import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    Image,
    ActivityIndicator,
  } from "react-native";
  import { useLocalSearchParams, useRouter } from "expo-router";
  import { useState } from "react";
  import { Video } from "expo-av";
  import api from "@/services/api";
  
  export default function StoryDetails() {
    const router = useRouter();
    const { uri, type } = useLocalSearchParams<{
      uri: string;
      type: "IMAGE" | "VIDEO";
    }>();
  
    const [city, setCity] = useState("");
    const [visibility, setVisibility] = useState<"PUBLIC" | "CLOSE_FRIENDS">(
      "PUBLIC"
    );
    const [uploading, setUploading] = useState(false);
  
    const uploadStory = async () => {
      try {
        setUploading(true);
  
        const formData = new FormData();
  
        formData.append("mediaUrl", {
          uri: uri.startsWith("file://") ? uri : `file://${uri}`,
          name: type === "VIDEO" ? "story.mp4" : "story.jpg",
          type: type === "VIDEO" ? "video/mp4" : "image/jpeg",
        } as any);
  
        formData.append("mediaType", type);
        formData.append("visibility", visibility);
        formData.append("city", city || "Unknown");
  
        if (type === "VIDEO") {
          formData.append("duration", "5");
        }
  
        await api.post("/story/", formData);
  
        router.replace("/feed"); // back to feed
      } catch (err) {
        console.error("Story upload failed", err);
      } finally {
        setUploading(false);
      }
    };
  
    return (
      <View style={styles.container}>
        {type === "IMAGE" ? (
          <Image source={{ uri }} style={styles.preview} />
        ) : (
          <Video
            source={{ uri }}
            style={styles.preview}
            shouldPlay
            resizeMode="cover"
          />
        )}
  
        <TextInput
          placeholder="Add city"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={city}
          onChangeText={setCity}
        />
  
        <View style={styles.visibilityRow}>
          {["PUBLIC", "CLOSE_FRIENDS"].map(v => (
            <Pressable
              key={v}
              style={[
                styles.visibilityBtn,
                visibility === v && styles.active,
              ]}
              onPress={() => setVisibility(v as any)}
            >
              <Text style={styles.visibilityText}>{v}</Text>
            </Pressable>
          ))}
        </View>
  
        <Pressable style={styles.post} onPress={uploadStory}>
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.postText}>Post Story</Text>
          )}
        </Pressable>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
    },
    preview: {
      width: "100%",
      height: "60%",
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: "#444",
      color: "#fff",
      margin: 16,
      paddingVertical: 10,
    },
    visibilityRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 12,
    },
    visibilityBtn: {
      borderWidth: 1,
      borderColor: "#444",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
    },
    active: {
      backgroundColor: "#0095f6",
      borderColor: "#0095f6",
    },
    visibilityText: {
      color: "#fff",
    },
    post: {
      marginTop: 30,
      alignSelf: "center",
      backgroundColor: "#0095f6",
      paddingHorizontal: 28,
      paddingVertical: 14,
      borderRadius: 30,
    },
    postText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });
  