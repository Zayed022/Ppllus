import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.title}>Set up your profile</Text>
        <Text style={styles.subtitle}>
          This helps people recognize you on Onwayz
        </Text>

        {/* First Name */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="First name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        {/* Surname */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Surname"
            value={surname}
            onChangeText={setSurname}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        {/* Username */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        {/* Helper */}
        <Text style={styles.helperText}>
          You can change your username later
        </Text>

        {/* CTA */}
        <Pressable style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 48,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    marginTop: 6,
    marginBottom: 32,
    lineHeight: 20,
  },

  inputWrapper: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#F6F6F6",
    paddingHorizontal: 16,
    justifyContent: "center",
    marginBottom: 16,
  },

  input: {
    fontSize: 16,
    color: "#000",
  },

  helperText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
    marginBottom: 32,
  },

  button: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
