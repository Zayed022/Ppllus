import { useEffect, useState } from "react";
import { View, Modal, ScrollView } from "react-native";
import { StoriesTray } from "../../components/stories/StoriesTray";
import { StoryViewer } from "../../components/stories/StoryViewer";
import { fetchStoryFeed, StoryUser } from "../../services/story.service";

export default function FeedScreen() {
  const [stories, setStories] = useState<StoryUser[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchStoryFeed().then(setStories);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StoriesTray data={stories} onOpen={setActiveIndex} />

      {/* Your existing feed posts below */}
      <ScrollView />

      <Modal visible={activeIndex !== null} animationType="fade">
        {activeIndex !== null && (
          <StoryViewer
            data={stories}
            userIndex={activeIndex}
            onClose={() => setActiveIndex(null)}
          />
        )}
      </Modal>
    </View>
  );
}
