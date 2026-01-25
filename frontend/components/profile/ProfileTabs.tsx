import {
    View,
    Pressable,
    FlatList,
    Image,
    Dimensions,
    StyleSheet,
  } from "react-native";
  import { Ionicons } from "@expo/vector-icons";
  import { useEffect, useState } from "react";
  import { getMyPosts } from "@/services/post.api";
  import { getMyReels } from "@/services/reel.api";
  import { useRouter } from "expo-router";
  
  const { width } = Dimensions.get("window");
  const ITEM_SIZE = width / 3;
  
  export default function ProfileTabs({ userId }: { userId: string }) {
    const [activeTab, setActiveTab] =
      useState<"POSTS" | "REELS" | "TAGGED">("POSTS");
  
    const [posts, setPosts] = useState<any[]>([]);
    const [reels, setReels] = useState<any[]>([]);
  
    const router = useRouter();
  
    useEffect(() => {
      if (activeTab === "POSTS") loadPosts();
      if (activeTab === "REELS") loadReels();
    }, [activeTab]);
  
    const loadPosts = async () => {
      const data = await getMyPosts();
      setPosts(data);
    };
  
    const loadReels = async () => {
      const data = await getMyReels();
      setReels(data);
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
            icon="person-outline"
            active={activeTab === "TAGGED"}
            onPress={() => setActiveTab("TAGGED")}
          />
        </View>
  
        {/* POSTS GRID */}
        {activeTab === "POSTS" && (
          <FlatList
            data={posts}
            numColumns={3}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/details",
                    params: { postId: item._id },
                  })
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
  
        {/* REELS GRID */}
        {activeTab === "REELS" && (
          <FlatList
            data={reels}
            numColumns={3}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/reels/[reelId]",
                    params: { reelId: item._id },
                  })
                }
              >
                <Image
                  source={{ uri: item.thumbnailUrl }}
                  style={styles.image}
                />
  
                {/* Reel icon overlay */}
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
      </View>
    );
  }
  
  function Tab({
    icon,
    active,
    onPress,
  }: {
    icon: any;
    active: boolean;
    onPress: () => void;
  }) {
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
  });
  