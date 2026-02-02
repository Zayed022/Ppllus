import { View, FlatList, ActivityIndicator } from "react-native";
import { useEffect, useState, useCallback } from "react";

import { searchUsers } from "@/services/search.api";
import {
  getExplorePosts,
  getExploreReels,
} from "@/services/explore.api";

import SearchBar from "@/components/search/SearchBar";
import UserSearchItem from "@/components/search/UserSearchItem";
import ExploreGridItem from "@/components/explore/ExploreGridItem";
import { mergeExplore } from "@/utils/mergeExplore";

export default function ExploreScreen() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [cursor, setCursor] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /* ---------------- LOAD EXPLORE GRID ---------------- */
  const loadExplore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const [postsRes, reelsRes] = await Promise.all([
        getExplorePosts(cursor),
        getExploreReels(cursor),
      ]);

      const merged = mergeExplore(
        postsRes.data,
        reelsRes.data
      );

      setItems(prev => [...prev, ...merged]);
      setCursor(postsRes.nextCursor);
      setHasMore(postsRes.data.length > 0);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, hasMore]);

  useEffect(() => {
    loadExplore();
  }, []);

  /* ---------------- SEARCH USERS ---------------- */
  useEffect(() => {
    let active = true;

    if (query.length < 2) {
      setUsers([]);
      return;
    }

    const run = async () => {
      const data = await searchUsers(query);
      if (active) setUsers(data);
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

      {/* 🔍 SEARCH MODE */}
      {query.length >= 2 ? (
        <FlatList
          key="search"                 // 🔥 CRITICAL FIX
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <UserSearchItem user={item} />
          )}
          keyboardShouldPersistTaps="handled"
        />
      ) : (
        /* 🧭 EXPLORE MODE */
        <FlatList
          key="explore"                // 🔥 CRITICAL FIX
          data={items}
          numColumns={3}
          keyExtractor={(item, idx) =>
            `${item.type}-${item.data._id}-${idx}`
          }
          renderItem={({ item }) => (
            <ExploreGridItem item={item} />
          )}
          onEndReached={loadExplore}
          onEndReachedThreshold={0.6}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator style={{ margin: 16 }} />
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
