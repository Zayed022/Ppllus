import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default function HomeHeader() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Left: Create */}
      <Pressable style={styles.iconButton}>
        <Feather name="plus" size={24} color="#000" />
      </Pressable>

      {/* Center: Brand */}
      <Text style={styles.logo}>Ppllus</Text>

      {/* Right: Activity */}
      <Pressable
      style={styles.iconButton}
      onPress={() => router.push("/message/inbox")}
    >
      <Feather name="heart" size={22} color="#000" />
    </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      height: 56,
      paddingHorizontal: 16,
      backgroundColor: "#fff",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 0.5,
      borderBottomColor: "#e5e5e5",
      marginTop:10
    },
  
    logo: {
      fontSize: 26,
      fontWeight: "700",
      color: "#000",
      letterSpacing: 0.3,
    },
  
    iconButton: {
      width: 40,
      alignItems: "center",
    },
  });
  