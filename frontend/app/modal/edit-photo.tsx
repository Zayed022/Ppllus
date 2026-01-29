import { View, Text, Pressable, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { updateProfileImage } from "@/services/profile.api";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function EditPhoto() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!selectedImage || uploading) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("profileImage", {
        uri: selectedImage,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);

      const updatedUser = await updateProfileImage(formData);

      // 🔥 Update auth state immediately
      setUser(updatedUser);

      router.back();
    } catch (e) {
      console.error("Profile image upload failed", e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={{ fontSize: 16 }}>Cancel</Text>
        </Pressable>

        <Text style={{ fontSize: 16, fontWeight: "700" }}>
          Change Profile Photo
        </Text>

        <Pressable
          onPress={handleSave}
          disabled={!selectedImage || uploading}
        >
          <Text
            style={{
              fontSize: 16,
              color: selectedImage ? "#0095f6" : "#aaa",
              fontWeight: "600",
            }}
          >
            Save
          </Text>
        </Pressable>
      </View>

      {/* Preview */}
      <View
        style={{
          alignItems: "center",
          marginVertical: 40,
        }}
      >
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            style={{
              width: 160,
              height: 160,
              borderRadius: 80,
            }}
          />
        ) : (
          <View
            style={{
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: "#eee",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#666" }}>No image selected</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      {uploading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Pressable onPress={pickImage}>
          <Text
            style={{
              color: "#0095f6",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Choose from gallery
          </Text>
        </Pressable>
      )}
    </View>
  );
}
