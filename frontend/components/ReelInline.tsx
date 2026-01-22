import { View, Text, StyleSheet } from "react-native";

export default function ReelInline({ reel }: { reel: any }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Reel: {reel._id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 400,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  text: {
    color: "#fff",
  },
});
