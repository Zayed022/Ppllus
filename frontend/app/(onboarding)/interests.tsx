import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import api from "@/services/api";

const INTERESTS = [
  "Sports",
  "Travel",
  "Food",
  "Music",
  "Movies",
  "Fitness",
  "Technology",
  "Fashion",
  "Photography",
  "Gaming",
  "Business",
  "Art",
];

export default function Interests() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const submit = async () => {
    if (selected.length === 0) {
      Alert.alert("Select interests", "Please choose at least one interest");
      return;
    }

    try {
      await api.patch("/users/profile/interests", {
        interests: selected,
      });

      router.push("/(onboarding)/profile-image");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Unable to save interests"
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>What are you interested in?</Text>
      <Text style={styles.subtitle}>
        Choose topics you’d like to see more of
      </Text>

      {/* Interests */}
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {INTERESTS.map((interest) => {
          const isSelected = selected.includes(interest);
          return (
            <Pressable
              key={interest}
              onPress={() => toggleInterest(interest)}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}
              >
                {interest}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* CTA */}
      <Pressable
        style={[
          styles.button,
          selected.length === 0 && { opacity: 0.5 },
        ]}
        onPress={submit}
        disabled={selected.length === 0}
      >
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </View>
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
    marginBottom: 24,
    lineHeight: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 24,
  },

  chip: {
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
  },

  chipSelected: {
    backgroundColor: "#000",
  },

  chipText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },

  chipTextSelected: {
    color: "#fff",
  },

  button: {
    marginTop: "auto",
    marginBottom: 24,
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
