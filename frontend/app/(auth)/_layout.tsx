import { Stack, router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function AuthLayout() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (user) {
      if (!user.isOnboarded) {
        router.replace("/(onboarding)/basic-profile");
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [user, loading]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
