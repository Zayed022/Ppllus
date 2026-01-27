import { View, FlatList, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { searchUsers } from "@/services/search.api";
import SearchBar from "@/components/search/SearchBar";
import UserSearchItem from "@/components/search/UserSearchItem";

export default function ExploreScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      const data = await searchUsers(query);
      if (active) setResults(data);
      setLoading(false);
    };

    const debounce = setTimeout(run, 300); // 🔥 Instagram debounce
    return () => {
      active = false;
      clearTimeout(debounce);
    };
  }, [query]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SearchBar value={query} onChange={setQuery} />

      {loading && <ActivityIndicator style={{ marginTop: 12 }} />}

      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <UserSearchItem user={item} />
        )}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}
