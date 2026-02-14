import { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Pressable,
  Text,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { searchUsers } from "@/services/search.api";


export default function NewMessageScreen() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

  const handleSearch = async (text: string) => {
    setQuery(text);

    const results = await searchUsers(text);
    setUsers(results);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <TextInput
        placeholder="Search"
        value={query}
        onChangeText={handleSearch}
        style={{
          backgroundColor: "#f2f2f2",
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        }}
      />

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          query.length >= 2 ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No users found
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            style={{ flexDirection: "row", padding: 10 }}
            onPress={() =>
              router.push(
                `/message/new-chat?otherUserId=${item._id}`
              )
            }
          >
            <Image
              source={{
                uri:
                  item.profileImage ||
                  `https://ui-avatars.com/api/?name=${item.username}`,
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 10,
              }}
            />
            <Text style={{ fontSize: 16 }}>
              {item.username}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
