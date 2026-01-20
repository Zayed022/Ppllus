import { View, Text, Pressable, StyleSheet } from "react-native";

interface Props {
  isSelf: boolean;
  isMuted: boolean;
  onDelete: () => void;
  onMuteToggle: () => void;
  onAddToHighlight: () => void;
}

export default function StoryActionsSheet({
  isSelf,
  isMuted,
  onDelete,
  onMuteToggle,
  onAddToHighlight,
}: Props) {
  return (
    <View style={styles.sheet}>
      {isSelf ? (
        <>
          <Pressable onPress={onDelete}>
            <Text style={styles.danger}>Delete story</Text>
          </Pressable>

          <Pressable onPress={onAddToHighlight}>
            <Text style={styles.item}>Add to highlight</Text>
          </Pressable>
        </>
      ) : (
        <Pressable onPress={onMuteToggle}>
          <Text style={styles.item}>
            {isMuted ? "Unmute stories" : "Mute stories"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  item: {
    fontSize: 16,
    paddingVertical: 14,
  },
  danger: {
    fontSize: 16,
    paddingVertical: 14,
    color: "red",
  },
});
