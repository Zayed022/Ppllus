import { View, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getPostComments, addPostComment } from "@/services/comment.api";
import CommentItem from "@/components/comments/CommentItem";
import CommentInput from "@/components/comments/CommentInput";
import { Comment } from "@/types/comment";

export default function CommentsModal() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    const data = await getPostComments(postId);
    setComments(data);
  };

  const onAdd = async (text: string) => {
    const optimistic: Comment = {
      _id: Date.now().toString(),
      text,
      likesCount: 0,
      createdAt: new Date().toISOString(),
      user: {
        _id: "me",
        username: "You",
        profileImage: "",
      },
    };

    setComments(prev => [optimistic, ...prev]);
    await addPostComment(postId, text);
    loadComments();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <FlatList
        data={comments}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <CommentItem comment={item} />
        )}
      />

      <CommentInput onSend={onAdd} />
    </KeyboardAvoidingView>
  );
}
