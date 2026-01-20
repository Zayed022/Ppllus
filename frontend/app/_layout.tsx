import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      {!user && <Redirect href="/(auth)/Login" />}

      {user && !user.isOnboarded && (
        <Redirect href="/(onboarding)/basic-profile" />
      )}

      {user && user.isOnboarded && (
        <Redirect href="/(tabs)/explore" />
      )}

      {/* ⚠️ Navigator MUST exist */}
      <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      </GestureHandlerRootView>
    </>
  );
}
