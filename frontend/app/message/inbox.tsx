import { FlatList, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { getInbox } from "@/services/message.api";
import InboxItem from "@/components/messages/InboxItem";
import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";


import { useAuth } from "@/context/AuthContext";


export default function InboxScreen() {
  const [conversations, setConversations] = useState<any[]>([]);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      loadInbox();
    }
  }, [loading, user]);

  const loadInbox = async () => {
    try {
      const data = await getInbox();
      console.log("FRONTEND INBOX RAW:", JSON.stringify(data));
      console.log("TYPE:", typeof data);
      console.log("IS ARRAY:", Array.isArray(data));
      setConversations(data);
    } catch (err) {
      console.log("INBOX ERROR:", err);
    }
  };
  

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>

      {/* HEADER */}
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        alignItems: "center"
      }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>
          Messages
        </Text>

        <Pressable onPress={() => router.push("/message/new")}>
          <Feather name="edit" size={22} />
        </Pressable>
      </View>

      {/* LIST */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <InboxItem conversation={item} />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40 }}>
            No conversations yet
          </Text>
        }
      />
    </View>
  );
}


