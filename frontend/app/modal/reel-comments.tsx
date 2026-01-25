import { View, FlatList, KeyboardAvoidingView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  getReelComments,
  addReelComment,
} from "@/services/reel.api";
import CommentItem from "@/components/comments/CommentItem";
import CommentInput from "@/components/comments/CommentInput";

export default function ReelCommentsModal() {
  const { reelId } = useLocalSearchParams<{ reelId: string }>();
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getReelComments(reelId);
    setComments(data);
  };

  const onSend = async (text: string) => {
    const optimistic = {
      _id: Date.now().toString(),
      text,
      createdAt: new Date().toISOString(),
      user: { username: "You" },
    };

    setComments(prev => [optimistic, ...prev]);
    await addReelComment(reelId, text);
    load();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, marginTop: 14 }}>
      <FlatList
        data={comments}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <CommentItem comment={item} />
        )}
      />
      <CommentInput onSend={onSend} />
    </KeyboardAvoidingView>
  );
}
