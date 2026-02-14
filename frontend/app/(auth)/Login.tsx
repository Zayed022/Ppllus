import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import api from "@/services/api";
import { saveTokens } from "@/services/auth.storage";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/users/login", {
        email,
        password,
      });

      const { accessToken, refreshToken, user } = res.data;

      await saveTokens(accessToken, refreshToken);
      setUser(user);

      if (!user.isOnboarded) {
        router.replace("/(onboarding)/basic-profile");
      } else {
        router.replace("/(tabs)/explore");
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        Alert.alert("Login failed", "Invalid email or password");
      } else {
        Alert.alert("Error", "Unable to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.title}>Log in or Signup to</Text>
        <Text style={styles.brand}>Onwayz</Text>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="john@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        {/* Continue */}
        {/* Continue */}
<TouchableOpacity
  style={[styles.button, loading && { opacity: 0.7 }]}
  onPress={handleLogin}
  disabled={loading}
>
  {loading ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text style={styles.buttonText}>Continue</Text>
  )}
</TouchableOpacity>

{/* Sign up */}
<View style={styles.signupWrapper}>
  <Text style={styles.signupText}>New to Onwayz?</Text>
  <TouchableOpacity onPress={() => router.push("/(auth)/Register")}>
    <Text style={styles.signupLink}> Sign up</Text>
  </TouchableOpacity>
</View>
</View>

    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 26,
    fontWeight: "500",
    color: "#000",
  },

  brand: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 32,
    color: "#000",
  },

  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },

  inputWrapper: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 14,
    height: 52,
    justifyContent: "center",
    paddingHorizontal: 14,
    marginBottom: 14,
  },

  input: {
    fontSize: 16,
    color: "#000",
  },

  button: {
    height: 54,
    backgroundColor: "#555",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  footer: {
    marginTop: 28,
    textAlign: "center",
    fontSize: 12,
    color: "#777",
  },
  signupWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  
  signupText: {
    fontSize: 14,
    color: "#555",
  },
  
  signupLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  
});
