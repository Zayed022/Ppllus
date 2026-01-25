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
  
  export default function ChatScreen() {
    const { conversationId } = useLocalSearchParams<{
      conversationId: string;
    }>();
  
    const [messages, setMessages] = useState<any[]>([]);
  
    useEffect(() => {
      loadMessages();
      markConversationSeen(conversationId);
    }, []);
  
    const loadMessages = async () => {
      const data = await getMessages(conversationId);
      setMessages(data);
    };
  
    const onSend = async (text: string, to: string) => {
      const optimistic = {
        _id: Date.now().toString(),
        body: text,
        fromMe: true,
      };
  
      setMessages((prev) => [optimistic, ...prev]);
      await sendMessage(to, text);
      loadMessages();
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
  