import { FlatList, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { getInbox } from "@/services/message.api";
import InboxItem from "@/components/messages/InboxItem";

import { useAuth } from "@/hooks/useAuth";

export default function InboxScreen() {
  const [conversations, setConversations] = useState<any[]>([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      loadInbox();
    }
  }, [loading, user]);

  const loadInbox = async () => {
    const data = await getInbox();
    console.log("INBOX DATA:", data);
  
    // ✅ normalize response
    setConversations(Array.isArray(data) ? data : [data]);
  };
  
  

  return (
   
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Text>INBOX SCREEN LOADED</Text>

      
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <InboxItem conversation={item} />
        )}
      />
      
    </View>
   
  );
}

