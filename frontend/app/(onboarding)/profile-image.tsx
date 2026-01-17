import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import api from "@/services/api";

export default function ProfileImage() {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow access to your photos"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadProfileImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("profileImage", {
      uri: image,
      name: "profile.jpg",
      type: "image/jpeg",
    } as any);

    setUploading(true);

    try {
      await api.patch("/users/profile/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      Alert.alert("Error", "Unable to upload profile image");
    } finally {
      setUploading(false);
    }
  };

  const finish = async () => {
    try {
      setFinishing(true);

      if (image) {
        await uploadProfileImage();
      }

      await api.post("/users/onboarding/complete");

      
    } catch (error) {
      setFinishing(false);
      Alert.alert("Error", "Unable to complete onboarding");
    }
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Pressable onPress={pickImage} style={styles.avatarWrapper}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.plus}>+</Text>
          </View>
        )}
      </Pressable>

      <Text style={styles.title}>Add a profile photo</Text>
      <Text style={styles.subtitle}>
        A profile photo helps people recognize you
      </Text>

      {/* CTA */}
      <Pressable
        style={[
          styles.button,
          (uploading || finishing) && { opacity: 0.7 },
        ]}
        onPress={finish}
        disabled={uploading || finishing}
      >
        {finishing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {image ? "Continue" : "Skip for now"}
          </Text>
        )}
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: "center",
  },

  avatarWrapper: {
    marginBottom: 24,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
  },

  plus: {
    fontSize: 40,
    color: "#999",
    fontWeight: "300",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 40,
    lineHeight: 20,
    paddingHorizontal: 16,
  },

  button: {
    width: "100%",
    height: 54,
    borderRadius: 16,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
