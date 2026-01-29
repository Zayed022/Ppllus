import { View, TextInput, Pressable, Text, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { updateBasicProfile } from "@/services/profile.api";
import { useAuth } from "@/hooks/useAuth";

export default function EditUsername() {
  const router = useRouter();
  const { user, setUser, loading } = useAuth();

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // 🔒 Wait for auth hydration
  useEffect(() => {
    if (!loading && user?.username) {
      setUsername(user.username);
    }
  }, [loading, user?.username]);

  // ✅ Loader instead of crash
  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const save = async () => {
    if (!username.trim() || saving) return;

    try {
      setSaving(true);
      const updated = await updateBasicProfile({ username });
      setUser(updated);
      router.back();
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setError("Username already taken");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={{ fontSize: 16 }}
      />

      {error ? (
        <Text style={{ color: "red", marginTop: 8 }}>{error}</Text>
      ) : null}

      <Pressable onPress={save} style={{ marginTop: 20 }}>
        <Text style={{ color: "#0095f6", fontWeight: "600" }}>
          Save
        </Text>
      </Pressable>
    </View>
  );
}
