import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { StoryGroup } from "@/types/story";
import { memo, useEffect, useRef } from "react";

interface Props {
  group: StoryGroup;
}

function StoryAvatar({ group }: Props) {
  const router = useRouter();

  const hasStory = group.stories.length > 0;
  const isSelf = group.isSelf;

  /**
   * ==========================
   * Ring animation state
   * 0 = red (unseen)
   * 1 = grey (seen / self)
   * ==========================
   */
  const ringAnim = useRef(
    new Animated.Value(
      !hasStory || isSelf || !group.hasUnseen ? 1 : 0
    )
  ).current;

  useEffect(() => {
    // Self stories are ALWAYS grey
    if (!hasStory || isSelf) {
      ringAnim.setValue(1);
      return;
    }

    Animated.timing(ringAnim, {
      toValue: group.hasUnseen ? 0 : 1,
      duration: 260,
      useNativeDriver: false, // borderColor cannot use native driver
    }).start();
  }, [group.hasUnseen, hasStory, isSelf]);

  const ringColor = ringAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ff3040", "#dcdcdc"],
  });

  const avatarUri =
    group.profileImage ??
    `https://ui-avatars.com/api/?name=${group.username ?? "User"}`;

  const onPress = () => {
    // Self with no story → create
    if (isSelf && !hasStory) {
      router.push("/create-story");
      return;
    }

    // View stories (self or others)
    router.push({
      pathname: "/story-viewer",
      params: {
        userId: group.user,
        isSelf: isSelf ? "true" : "false",
        fromFeed: "true",
      },
    });
  };

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <Animated.View
        style={[
          styles.ring,
          { borderColor: hasStory ? ringColor : "#dcdcdc" },
        ]}
      >
        <Image source={{ uri: avatarUri }} style={styles.avatar} />

        {isSelf && !hasStory && (
          <View style={styles.addBadge}>
            <Text style={styles.addText}>+</Text>
          </View>
        )}
      </Animated.View>

      <Text style={styles.username} numberOfLines={1}>
        {isSelf ? "Your story" : group.username ?? "user"}
      </Text>
    </Pressable>
  );
}

/**
 * ==========================
 * Memoization
 * Re-render ONLY when visual state changes
 * ==========================
 */
export default memo(
  StoryAvatar,
  (prev, next) =>
    prev.group.hasUnseen === next.group.hasUnseen &&
    prev.group.profileImage === next.group.profileImage &&
    prev.group.stories.length === next.group.stories.length &&
    prev.group.isSelf === next.group.isSelf
);

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
