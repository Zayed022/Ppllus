import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getMessages,
  markConversationSeen,
  sendMessage,
} from "@/services/message.api";
import MessageBubble from "@/components/messages/MessageBubble";
import MessageInput from "@/components/messages/MessageInput";
import { useAuth } from "@/context/AuthContext";

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const conversationId =
    (params.id as string) ||
    (params.conversationId as string);

  const otherUserId = params.otherUserId as string;
  const username = params.username as string;
  const profileImage = params.profileImage as string;

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD MESSAGES ---------------- */

  const loadMessages = useCallback(async () => {
    if (!conversationId || !user) return;
  
    try {
      setLoading(true);
  
      const data = await getMessages(conversationId);
  
      if (!Array.isArray(data)) return;
  
      const currentUserId =
        user._id?.toString?.() ||
        user.id?.toString?.() ||
        user.sub?.toString?.();
  
      const mapped = data.map((msg: any) => ({
        ...msg,
        fromMe: msg.senderId?.toString() === currentUserId,
      }));
  
      setMessages(mapped.reverse());
    } catch (err) {
      console.log("LOAD MESSAGE ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, user]);
  

  useEffect(() => {
    if (!conversationId || !user) return;
    loadMessages();
    markConversationSeen(conversationId);
  }, [conversationId, user]);

  /* ---------------- SEND MESSAGE ---------------- */

  const onSend = async (text: string) => {
    if (!otherUserId || !user) return;

    const optimistic = {
      _id: `optimistic-${Date.now()}`,
      body: text,
      senderId: user._id,
      fromMe: true,
    };

    // Add to top because inverted
    setMessages((prev) => [optimistic, ...prev]);

    try {
      await sendMessage(otherUserId, text);
      loadMessages();
    } catch (err) {
      console.log("SEND ERROR:", err);
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <View style={styles.container}>
  
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
  
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
  
        <Text style={styles.username}>
          {username || "Chat"}
        </Text>
      </View>
  
      {/* CHAT BODY */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <FlatList
          style={styles.list}
          data={messages.filter(Boolean)}
          inverted
          keyExtractor={(item) => item._id?.toString()}
          renderItem={({ item }) => (
            <MessageBubble message={item} />
          )}
          contentContainerStyle={{
            padding: 12,
          }}
          keyboardShouldPersistTaps="handled"
        />
  
        <View style={styles.inputWrapper}>
          <MessageInput onSend={onSend} />
        </View>
  
      </KeyboardAvoidingView>
    </View>
  );
  
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  back: {
    fontSize: 26,
    marginRight: 12,
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },

  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ddd",
    marginRight: 8,
  },

  username: {
    fontSize: 16,
    fontWeight: "600",
  },
  chatContainer: {
    flex: 1,
  },
  
  list: {
    flex: 1,
  },
  
  inputWrapper: {
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  
});
