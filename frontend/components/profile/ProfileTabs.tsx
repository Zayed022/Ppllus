import {
  View,
  Pressable,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { getMyPosts } from "@/services/post.api";
import { getMyReels } from "@/services/reel.api";
import { getSuggestedUsers, followUser } from "@/services/discovery.api";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const ITEM_SIZE = width / 3;

export default function ProfileTabs({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] =
    useState<"POSTS" | "REELS" | "TAGGED">("POSTS");

  const [posts, setPosts] = useState<any[]>([]);
  const [reels, setReels] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (activeTab === "POSTS") loadPosts();
    if (activeTab === "REELS") loadReels();
    if (activeTab === "TAGGED") loadSuggestions();
  }, [activeTab]);

  const loadPosts = async () => {
    const data = await getMyPosts();
    setPosts(data);
  };

  const loadReels = async () => {
    const data = await getMyReels();
    setReels(data);
  };

  const loadSuggestions = async () => {
    const data = await getSuggestedUsers();
    setSuggestions(data);
  };

  const handleFollow = async (id: string) => {
    // optimistic update
    setSuggestions(prev =>
      prev.filter(user => user._id !== id)
    );

    try {
      await followUser(id);
    } catch (err) {
      console.log("Follow failed", err);
    }
  };

  return (
    <View>
      {/* Tabs */}
      <View style={styles.tabs}>
        <Tab
          icon="grid-outline"
          active={activeTab === "POSTS"}
          onPress={() => setActiveTab("POSTS")}
        />
        <Tab
          icon="videocam-outline"
          active={activeTab === "REELS"}
          onPress={() => setActiveTab("REELS")}
        />
        <Tab
          icon="person-add-outline"
          active={activeTab === "TAGGED"}
          onPress={() => setActiveTab("TAGGED")}
        />
      </View>

      {/* POSTS */}
      {activeTab === "POSTS" && (
        <FlatList
          data={posts}
          numColumns={3}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push(`/post/${item._id}`)
              }
            >
              <Image
                source={{ uri: item.media[0].url }}
                style={styles.image}
              />
            </Pressable>
          )}
          scrollEnabled={false}
        />
      )}

      {/* REELS */}
      {activeTab === "REELS" && (
        <FlatList
          data={reels}
          numColumns={3}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push(`/reels/${item._id}`)
              }
            >
              <Image
                source={{ uri: item.thumbnailUrl }}
                style={styles.image}
              />
              <Ionicons
                name="videocam"
                size={16}
                color="#fff"
                style={styles.videoIcon}
              />
            </Pressable>
          )}
          scrollEnabled={false}
        />
      )}

      {/* SUGGESTED USERS */}
      {activeTab === "TAGGED" && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.suggestionCard}>
              <Pressable
                style={styles.userInfo}
                onPress={() =>
                  router.push(`/profile/${item._id}`)
                }
              >
                <Image
                  source={{ uri: item.profileImage }}
                  style={styles.avatar}
                />
                <Text style={styles.username}>
                  {item.username}
                </Text>
              </Pressable>

              <Pressable
                style={styles.followButton}
                onPress={() => handleFollow(item._id)}
              >
                <Text style={styles.followText}>
                  Follow
                </Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text>No suggestions available</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

function Tab({ icon, active, onPress }: any) {
  return (
    <Pressable style={styles.tab} onPress={onPress}>
      <Ionicons
        name={icon}
        size={22}
        color={active ? "#000" : "#999"}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  image: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderWidth: 0.5,
    borderColor: "#fff",
  },
  videoIcon: {
    position: "absolute",
    top: 6,
    right: 6,
  },
  suggestionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#f2f2f2",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  username: {
    fontWeight: "600",
    fontSize: 15,
  },
  followButton: {
    backgroundColor: "#0095f6",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  followText: {
    color: "#fff",
    fontWeight: "600",
  },
  empty: {
    alignItems: "center",
    marginTop: 40,
  },
});
