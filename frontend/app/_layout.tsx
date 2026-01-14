import { Stack, router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";

export default function RootLayout() {
  const { user, loading } = useAuth();

  // ✅ ALWAYS call hooks
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/(auth)/Login");
    } else if (!user.isOnboarded) {
      router.replace("/(onboarding)/basic-profile");
    } else {
      router.replace("/(tabs)");
    }
  }, [user, loading]);

  // ✅ Conditional rendering AFTER hooks
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
