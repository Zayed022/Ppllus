import { FlatList, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { getUserProfile, getUserPosts } from "@/services/profile.api";
import { getFollowers, getFollowing } from "@/services/follow.api";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePostsGrid from "@/components/profile/ProfilePostGrid";
import { useAuth } from "@/hooks/useAuth";

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { user: me } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (userId) load();
  }, [userId]);

  const load = async () => {
    const [user, postsRes, followers, following] = await Promise.all([
      getUserProfile(userId),
      getUserPosts(userId),
      getFollowers(userId),
      getFollowing(userId),
    ]);

    setProfile(user);
    setPosts(postsRes);
    setFollowersCount(followers.length);
    setFollowingCount(following.length);

    // Instagram-style follow check
    setIsFollowing(
      followers.some((f: any) => f._id === me?._id)
    );
  };

  if (!profile) return null;

  return (
    <FlatList
  data={posts}
  extraData={profile} // still required
  keyExtractor={(item) => item._id}
  numColumns={3}
  renderItem={({ item }) => <ProfilePostsGrid post={item} />}
  ListHeaderComponent={() => (
    <View style={{ backgroundColor: "#fff" }}>
      <ProfileHeader
        profile={profile}
        followersCount={followersCount}
        followingCount={followingCount}
        isOwnProfile={me?._id === profile._id}
        isFollowing={isFollowing}
        onFollow={() => {}}
      />
    </View>
  )}
  
  contentContainerStyle={{ paddingBottom: 40 }}
  showsVerticalScrollIndicator={false}
/>


  );
}
