import { FlatList, View, StyleSheet } from "react-native";
import { StoryBubble } from "./StoryBubble";
import { StoryUser } from "../../services/story.service";

interface Props {
  data: StoryUser[];
  onOpen: (index: number) => void;
}

export function StoriesTray({ data, onOpen }: Props) {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.user._id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <StoryBubble
            username={item.user.username}
            image={item.user.profileImage}
            hasUnseen={item.hasUnseen}
            onPress={() => onOpen(index)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
});
