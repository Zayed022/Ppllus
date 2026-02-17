import { FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { getUserProfile, getUserPosts } from "@/services/profile.api";
import { followUser, unfollowUser } from "@/services/follow.api";
import { useRouter } from "expo-router";

import ProfileHeader from "@/components/profile/ProfileHeader2";
import ProfilePostsGrid from "@/components/profile/ProfilePostGrid";
import { useAuth } from "@/hooks/useAuth";

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { user: me } = useAuth();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [counts, setCounts] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  useEffect(() => {
    if (userId) load();
  }, [userId]);

  const load = async () => {
    const [profileRes, postsRes] = await Promise.all([
      getUserProfile(userId),
      getUserPosts(userId),
    ]);

    setUser(profileRes.user);
    setCounts(profileRes.counts);
    setIsFollowing(profileRes.isFollowing);
    setIsRequested(profileRes.isRequested);
    setPosts(postsRes);
  };

  const handleMessage = () => {
    router.push({
      pathname: "/message/new-chat",
      params: {
        otherUserId: user._id,
        username: user.username,
        profileImage: user.profileImage,
      },
    });
  };
  

  const handleFollowToggle = async () => {
    if (loadingFollow) return;
    setLoadingFollow(true);
  
    try {
      if (isFollowing || isRequested) {
        await unfollowUser(user._id);
  
        setIsFollowing(false);
        setIsRequested(false);
        setCounts((c: any) => ({
          ...c,
          followers: Math.max(0, c.followers - 1),
        }));
      } else {
        const res = await followUser(user._id);
  
        // ✅ ACTIVE FOLLOW
        if (res?.follow?.status === "ACTIVE") {
          setIsFollowing(true);
          setCounts((c: any) => ({
            ...c,
            followers: c.followers + 1,
          }));
          return;
        }
  
        // 🔒 PRIVATE ACCOUNT
        if (res?.follow?.status === "REQUESTED") {
          setIsRequested(true);
          return;
        }
      }
    } catch (err: any) {
      const status = err?.response?.status;
    
      // ✅ Already following
      if (status === 409) {
        if (err?.response?.data?.status === "ACTIVE") {
          setIsFollowing(true);
          setIsRequested(false);
        } else if (err?.response?.data?.status === "REQUESTED") {
          setIsRequested(true);
        }
        return;
      }
    
      // ❌ Real auth failure
      if (status === 401) {
        console.warn("Session expired – login again");
        return;
      }
    
      console.error("Follow error:", err?.response?.data || err.message);
    }
     finally {
      setLoadingFollow(false);
    }
  };
  
  

  if (!user || !counts) return null;

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item._id}
      numColumns={3}
      renderItem={({ item }) => <ProfilePostsGrid post={item} />}
      ListHeaderComponent={() => (
        <ProfileHeader
  user={user}
  counts={counts}
  isOwnProfile={me?._id === user._id}
  isFollowing={isFollowing}
  isRequested={isRequested}
  onFollow={handleFollowToggle}
  onMessage={handleMessage}
  loadingFollow={loadingFollow}
/>

      )}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
