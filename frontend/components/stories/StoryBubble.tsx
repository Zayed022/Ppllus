import { View, Text, Image, Pressable, StyleSheet } from "react-native";

interface Props {
  username: string;
  image: string;
  hasUnseen: boolean;
  onPress: () => void;
}

export function StoryBubble({
  username,
  image,
  hasUnseen,
  onPress,
}: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View
        style={[
          styles.ring,
          { borderColor: hasUnseen ? "#ff0050" : "#ccc" },
        ]}
      >
        <Image source={{ uri: image }} style={styles.avatar} />
      </View>
      <Text numberOfLines={1} style={styles.username}>
        {username}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 72,
    alignItems: "center",
    marginHorizontal: 6,
  },
  ring: {
    borderWidth: 2,
    padding: 3,
    borderRadius: 40,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  username: {
    fontSize: 11,
    marginTop: 4,
  },
});
