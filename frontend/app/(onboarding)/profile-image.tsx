import { View, TextInput, Pressable, Text } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
export default function Complete() {
    const router = useRouter();
  
    const finish = async () => {
      const token = await SecureStore.getItemAsync("accessToken");
  
      await axios.post(
        "http://localhost:8000/users/onboarding/complete",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      router.replace("/(tabs)/feed");
    };
  
    return (
      <View>
        <Text>All Set!</Text>
        <Pressable onPress={finish}>
          <Text>Continue</Text>
        </Pressable>
      </View>
    );
  }
  