import { useEffect, useState } from "react";
import { Dimensions, Image, Pressable } from "react-native";
import { Video } from "expo-av";
import { StoryUser, markStoryViewed } from "../../services/story.service";

const { width, height } = Dimensions.get("window");

interface Props {
  data: StoryUser[];
  userIndex: number;
  onClose: () => void;
}

export function StoryViewer({ data, userIndex, onClose }: Props) {
  const [storyIndex, setStoryIndex] = useState(0);
  const story = data[userIndex].stories[storyIndex];

  useEffect(() => {
    markStoryViewed(story._id);
  }, [storyIndex]);

  const next = () => {
    if (storyIndex < data[userIndex].stories.length - 1) {
      setStoryIndex((i) => i + 1);
    } else {
      onClose();
    }
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={next}>
      {story.mediaType === "IMAGE" ? (
        <Image
          source={{ uri: story.mediaUrl }}
          style={{ width, height }}
          resizeMode="cover"
        />
      ) : (
        <Video
          source={{ uri: story.mediaUrl }}
          style={{ width, height }}
          resizeMode="cover"
          shouldPlay
        />
      )}
    </Pressable>
  );
}
