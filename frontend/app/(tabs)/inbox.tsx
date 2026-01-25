import { FlatList, View } from "react-native";
import { useEffect, useState } from "react";
import { getInbox } from "@/services/message.api";
import InboxItem from "@/components/messages/InboxItem";

export default function InboxScreen() {
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    loadInbox();
  }, []);

  const loadInbox = async () => {
    const data = await getInbox();
    setConversations(data);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <InboxItem conversation={item} />}
      />
    </View>
  );
}
