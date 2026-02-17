import {
  ScrollView,
  RefreshControl,
} from "react-native";
import { useEffect, useState, useCallback } from "react";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileActions from "@/components/profile/ProfileActions";
import ProfileBio from "@/components/profile/ProfileBio";
import ProfileTabs from "@/components/profile/ProfileTabs";

import { getMe, getMyProfileImage } from "@/services/user.api";

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  /* ---------------- LOAD PROFILE ---------------- */

  const loadProfile = async () => {
    try {
      const [me, image] = await Promise.all([
        getMe(),
        getMyProfileImage(),
      ]);

      setUser(me);
      setProfileImage(image?.profileImage ?? null);
    } catch (err) {
      console.log("PROFILE LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /* ---------------- PULL TO REFRESH ---------------- */

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadProfile();
    } finally {
      setRefreshing(false);
    }
  }, []);

  if (!user) return null;

  return (
    <ScrollView
      style={{ backgroundColor: "#fff" }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <ProfileHeader
        username={user.username}
        profileImage={profileImage}
        walletBalance={user.wallet?.balance ?? 0}
      />

      <ProfileBio user={user} />

      <ProfileActions
        userId={user._id}
        isOwnProfile={true}
        username={user.username} 
      />

      <ProfileTabs userId={user._id} />
    </ScrollView>
  );
}
