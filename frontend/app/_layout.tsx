import { Stack } from "expo-router";
import { Audio } from "expo-av";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,   // IMPORTANT
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
    });
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="message" />
      </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
