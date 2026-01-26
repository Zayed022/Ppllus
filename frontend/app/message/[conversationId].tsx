import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  getMessages,
  markConversationSeen,
  sendMessage,
} from "@/services/message.api";
import MessageBubble from "@/components/messages/MessageBubble";
import MessageInput from "@/components/messages/MessageInput";
import { useAuth } from "@/hooks/useAuth";

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const conversationId = Array.isArray(params.conversationId)
    ? params.conversationId[0]
    : params.conversationId;

  const otherUserId = params.otherUserId as string;
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  console.log("🔥 ChatScreen mounted");


  useEffect(() => {
    if (!conversationId || !user) return;
    loadMessages(conversationId);
    markConversationSeen(conversationId);
  }, [conversationId, user]);

  const loadMessages = async (cid: string) => {
    const data = await getMessages(cid);

    const mapped = data
      .map((msg: any) => ({
        ...msg,
        fromMe: msg.senderId === user._id,
      }))
      .reverse();

    setMessages(mapped);
  };

  const onSend = async (text: string) => {
    if (!otherUserId) return;

    const optimistic = {
      _id: Date.now().toString(),
      body: text,
      fromMe: true,
    };

    setMessages((prev) => [optimistic, ...prev]);
    await sendMessage(otherUserId, text);
    loadMessages(conversationId);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
  style={{ flex: 1 }}   // ✅ REQUIRED
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
