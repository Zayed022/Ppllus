import {
    View,
    Text,
    TextInput,
    Pressable,
    Image,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
  } from "react-native";
  import { useEffect, useState } from "react";
  import { useRouter } from "expo-router";
  
  import { getMe } from "@/services/user.api";
  import { updateBasicProfile } from "@/services/profile.api";
  import { useAuth } from "@/hooks/useAuth";
  
  const resolveProfileImage = (uri?: string, username?: string) => {
    if (!uri) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        username || "User"
      )}`;
    }
    return uri.startsWith("http")
      ? uri.replace(/^http:\/\//, "https://")
      : uri;
  };
  
  export default function EditProfile() {
    const router = useRouter();
    const { setUser } = useAuth();
  
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
  
    const [firstName, setFirstName] = useState("");
    const [surname, setSurname] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState<string | undefined>();
  
    useEffect(() => {
      const load = async () => {
        try {
          const me = await getMe();
  
          setFirstName(me.firstName ?? "");
          setSurname(me.surname ?? "");
          setUsername(me.username ?? "");
          setBio(me.bio ?? ""); // 👈 bio may not exist yet
          setProfileImage(me.profileImage);
        } catch (e) {
          console.error("Failed to load edit profile", e);
        } finally {
          setLoading(false);
        }
      };
  
      load();
    }, []);
  
    const save = async () => {
      try {
        setSaving(true);
  
        const updated = await updateBasicProfile({
          firstName,
          surname,
          username,
          bio,
        });
  
        setUser(updated); // sync auth
        router.back();
      } finally {
        setSaving(false);
      }
    };
  
    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 16,
              borderBottomWidth: 0.5,
              borderColor: "#ddd",
            }}
          >
            <Pressable onPress={() => router.back()}>
              <Text style={{ fontSize: 16 }}>Cancel</Text>
            </Pressable>
  
            <Text style={{ fontSize: 16, fontWeight: "700" }}>
              Edit Profile
            </Text>
  
            <Pressable onPress={save} disabled={saving}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: saving ? "#aaa" : "#0095f6",
                }}
              >
                Save
              </Text>
            </Pressable>
          </View>
  
          {/* Avatar */}
          <View style={{ alignItems: "center", marginVertical: 24 }}>
            <Image
              source={{
                uri: resolveProfileImage(profileImage, username),
              }}
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                backgroundColor: "#eee",
              }}
            />
  
            <Pressable onPress={() => router.push("/modal/edit-photo")}>
              <Text style={{ color: "#0095f6", marginTop: 12 }}>
                Change profile photo
              </Text>
            </Pressable>
          </View>
  
          <Field label="First name" value={firstName} onChange={setFirstName} />
          <Field label="Surname" value={surname} onChange={setSurname} />
          <Field
            label="Username"
            value={username}
            onChange={setUsername}
            autoCapitalize="none"
          />
          <Field
            label="Bio"
            value={bio}
            onChange={setBio}
            multiline
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
  
  /* ---------- Field ---------- */
  
  function Field({
    label,
    value,
    onChange,
    multiline,
    autoCapitalize,
  }: any) {
    return (
      <View style={{ paddingHorizontal: 16, marginBottom: 18 }}>
        <Text style={{ color: "#666", marginBottom: 6 }}>{label}</Text>
        <TextInput
          value={value}
          onChangeText={onChange}
          multiline={multiline}
          autoCapitalize={autoCapitalize}
          style={{
            fontSize: 16,
            paddingVertical: 6,
            borderBottomWidth: 1,
            borderColor: "#ddd",
          }}
        />
      </View>
    );
  }
  