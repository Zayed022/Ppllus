import { View, Text, StyleSheet } from "react-native";

export default function ReelInline({ reel }: { reel: any }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎬 Reel</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 400,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    color: "#fff",
    fontSize: 18,
  },
});
