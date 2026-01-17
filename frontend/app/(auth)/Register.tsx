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

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !phone || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/users/register", {
        email,
        phone,
        password,
      });

      const { accessToken, refreshToken, user } = res.data;

      await saveTokens(accessToken, refreshToken);

      // 🔐 New users are NEVER onboarded
      router.replace("/(onboarding)/basic-profile");
    } catch (err: any) {
        console.log("REGISTER ERROR", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          headers: err.response?.headers,
        });
      
        Alert.alert(
          "Error",
          err.response?.data?.message || "Unable to create account"
        );
            
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
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          Join Onwayz and start earning rewards
        </Text>

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

        {/* Phone */}
        <Text style={styles.label}>Phone</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="9876543210"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Minimum 6 characters"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        {/* Create Account */}
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/Login")}>
            <Text style={styles.footerLink}> Log in</Text>
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
      fontWeight: "700",
      color: "#000",
    },
  
    subtitle: {
      fontSize: 14,
      color: "#666",
      marginTop: 6,
      marginBottom: 28,
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
      marginBottom: 16,
    },
  
    input: {
      fontSize: 16,
      color: "#000",
    },
  
    button: {
      height: 54,
      backgroundColor: "#000",
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
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 24,
    },
  
    footerText: {
      fontSize: 14,
      color: "#555",
    },
  
    footerLink: {
      fontSize: 14,
      fontWeight: "600",
      color: "#000",
    },
  });
  