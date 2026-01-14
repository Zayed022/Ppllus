import { View, TextInput, Pressable, Text } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function DobGender() {
    const router = useRouter();
  
    const submit = async () => {
      const token = await SecureStore.getItemAsync("accessToken");
  
      await axios.patch(
        "http://localhost:8000/users/profile/dob-gender",
        {
          dob: "2000-01-01",
          gender: "MALE",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      router.push("/(onboarding)/interests");
    };
  
    return (
      <View>
        <Text>Select Gender</Text>
        <Pressable onPress={submit}>
          <Text>Next</Text>
        </Pressable>
      </View>
    );
  }
  