import { useState } from "react";
import { View, TextInput, Pressable, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import api from "@/services/api";

export default function BasicProfile() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");

  const submit = async () => {
    if (!firstName || !surname || !username) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      await api.patch("/users/profile/basic", {
        firstName,
        surname,
        username,
      });

      router.push("/(onboarding)/dob-gender");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Unable to update profile"
      );
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: "#fff" }}>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={{ borderBottomWidth: 1, marginBottom: 16 }}
      />

      <TextInput
        placeholder="Surname"
        value={surname}
        onChangeText={setSurname}
        style={{ borderBottomWidth: 1, marginBottom: 16 }}
      />

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={{ borderBottomWidth: 1, marginBottom: 24 }}
      />

      <Pressable
        onPress={submit}
        style={{
          backgroundColor: "#555",
          padding: 16,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Next</Text>
      </Pressable>
    </View>
  );
}
