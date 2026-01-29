import { View, FlatList, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

import { searchUsers } from "@/services/search.api";
import { getExploreReels } from "@/services/explore.api";

import SearchBar from "@/components/search/SearchBar";
import UserSearchItem from "@/components/search/UserSearchItem";
import ExploreGridItem from "@/components/explore/ExploreGridItem";

export default function ExploreScreen() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [explore, setExplore] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD EXPLORE FEED ---------------- */
  useEffect(() => {
    loadExplore();
  }, []);

  const loadExplore = async () => {
    const data = await getExploreReels();
    setExplore(data);
  };

  /* ---------------- SEARCH USERS ---------------- */
  useEffect(() => {
    let active = true;

    if (query.length < 2) {
      setUsers([]);
      return;
    }

    const run = async () => {
      setLoading(true);
      const data = await searchUsers(query);
      if (active) setUsers(data);
      setLoading(false);
    };

    const debounce = setTimeout(run, 300);
    return () => {
      active = false;
      clearTimeout(debounce);
    };
  }, [query]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SearchBar value={query} onChange={setQuery} />

      {/* SEARCH MODE */}
      {query.length >= 2 ? (
        <>
          {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
          <FlatList
            data={users}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <UserSearchItem user={item} />
            )}
            keyboardShouldPersistTaps="handled"
          />
        </>
      ) : (
        /* EXPLORE MODE */
        <FlatList
          data={explore}
          numColumns={3}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ExploreGridItem item={item} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
