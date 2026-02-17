import { useState } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MessageInput from "@/components/messages/MessageInput";
import { sendMessage } from "@/services/message.api";
import MessageBubble from "@/components/messages/MessageBubble";
import { uploadToCloudinary } from "@/services/upload.api";
import { useAuth } from "@/context/AuthContext";

export default function NewChatScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const otherUserId =
    Array.isArray(params.otherUserId)
      ? params.otherUserId[0]
      : params.otherUserId;

  const [messages, setMessages] = useState<any[]>([]);

  const onSend = async ({ text, media }: any) => {
    if (!otherUserId || !user) return;

    let uploadedMedia = null;

    try {
      if (media) {
        const uploadRes = await uploadToCloudinary(media);

        uploadedMedia = {
          url: uploadRes.secure_url,
          type: media.type?.includes("video")
            ? "VIDEO"
            : "IMAGE",
        };
      }

      const optimistic = {
        _id: `optimistic-${Date.now()}`,
        body: text || "",
        media: uploadedMedia,
        fromMe: true,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [optimistic, ...prev]);

      const result = await sendMessage(
        otherUserId,
        text,
        uploadedMedia
      );

      router.replace({
        pathname: "/message/[conversationId]",
        params: {
          conversationId: result.conversationId,
          otherUserId,
        },
      });

    } catch (err) {
      console.log("Send error:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <FlatList
        data={messages}
        inverted
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MessageBubble message={item} />
        )}
      />

      <MessageInput onSend={onSend} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
