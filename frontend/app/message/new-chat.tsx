import { useState } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MessageInput from "@/components/messages/MessageInput";
import { sendMessage } from "@/services/message.api";
import MessageBubble from "@/components/messages/MessageBubble";

export default function NewChatScreen() {
  const { otherUserId } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);

  const onSend = async (text: string) => {
    const optimistic = {
      _id: `optimistic-${Date.now()}`,
      body: text,
      fromMe: true,
    };

    setMessages((prev) => [optimistic, ...prev]);

    try {
      const result = await sendMessage(
        otherUserId as string,
        text
      );

      // 🔥 STEP 4 IMPLEMENTED HERE
      router.replace(
        `/message/${result.conversationId}?otherUserId=${otherUserId}`
      );

    } catch (err) {
      console.log("Send error:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
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
