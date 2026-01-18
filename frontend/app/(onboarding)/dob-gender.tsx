import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import api from "@/services/api";

type Gender = "MALE" | "FEMALE" | "OTHER";

export default function DobGender() {
  const router = useRouter();
  const [dob, setDob] = useState<Date>(new Date(2000, 0, 1));
  const [showPicker, setShowPicker] = useState(false);
  const [gender, setGender] = useState<Gender | null>(null);

  const submit = async () => {
    if (!gender) return;

    await api.patch("/users/profile/dob-gender", {
      dob: dob.toISOString().split("T")[0],
      gender,
    });

    router.push("/(onboarding)/interests");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Tell us about yourself</Text>
      <Text style={styles.subtitle}>
        This information helps personalize your experience
      </Text>

      {/* DOB */}
      <Text style={styles.sectionLabel}>Date of birth</Text>
      <Pressable
        style={styles.selector}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.selectorText}>
          {dob.toDateString()}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          onChange={(_, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDob(selectedDate);
          }}
        />
      )}

      {/* Gender */}
      <Text style={styles.sectionLabel}>Gender</Text>

      <View style={styles.genderRow}>
        {["MALE", "FEMALE", "OTHER"].map((item) => (
          <Pressable
            key={item}
            onPress={() => setGender(item as Gender)}
            style={[
              styles.genderCard,
              gender === item && styles.genderSelected,
            ]}
          >
            <Text
              style={[
                styles.genderText,
                gender === item && styles.genderTextSelected,
              ]}
            >
              {item.charAt(0) + item.slice(1).toLowerCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* CTA */}
      <Pressable
        style={[styles.button, !gender && { opacity: 0.5 }]}
        onPress={submit}
        disabled={!gender}
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
    marginBottom: 32,
    lineHeight: 20,
  },

  sectionLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    marginTop: 16,
  },

  selector: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  selectorText: {
    fontSize: 16,
    color: "#000",
  },

  genderRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  genderCard: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
  },

  genderSelected: {
    backgroundColor: "#000",
  },

  genderText: {
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
  },

  genderTextSelected: {
    color: "#fff",
  },

  button: {
    marginTop: 48,
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
