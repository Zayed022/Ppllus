import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { StoryGroup } from "@/types/story";
import { memo } from "react";

interface Props {
  group: StoryGroup;
}

function StoryAvatar({ group }: Props) {
  const router = useRouter();

  const hasStory = group.stories.length > 0;
  const isSelf = group.isSelf;

  const ringColor =
    hasStory && group.hasUnseen ? "#ff3040" : "#dcdcdc";

  const avatarUri =
    group.profileImage ??
    `https://ui-avatars.com/api/?name=${group.username ?? "User"}`;

  const onPress = () => {
    if (isSelf && !hasStory) {
      router.push("/create-story");
      return;
    }

    router.push({
      pathname: "/story-viewer",
      params: { userId: group.user },
    });
  };

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <View style={[styles.ring, { borderColor: ringColor }]}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />

        {isSelf && !hasStory && (
          <View style={styles.addBadge}>
            <Text style={styles.addText}>+</Text>
          </View>
        )}
      </View>

      <Text style={styles.username} numberOfLines={1}>
        {isSelf ? "Your story" : group.username ?? "user"}
      </Text>
    </Pressable>
  );
}

export default memo(StoryAvatar);

const styles = StyleSheet.create({
  wrapper: {
    width: 72,
    alignItems: "center",
    marginRight: 14,
  },
  ring: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2.5,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#eee",
  },
  username: {
    marginTop: 6,
    fontSize: 12,
    color: "#000",
  },
  addBadge: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#0095f6",
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  addText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
