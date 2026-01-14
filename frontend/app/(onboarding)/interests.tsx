import { View, TextInput, Pressable, Text } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function Interests() {
    const router = useRouter();
  
    const submit = async () => {
      const token = await SecureStore.getItemAsync("accessToken");
  
      await axios.patch(
        "http://localhost:8000/users/profile/interests",
        { interests: ["Sports", "Travel"] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      router.push("/(onboarding)/profile-image");
    };
  
    return (
      <View>
        <Text>Select Interests</Text>
        <Pressable onPress={submit}>
          <Text>Next</Text>
        </Pressable>
      </View>
    );
  }
  