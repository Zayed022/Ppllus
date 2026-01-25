import { ScrollView } from "react-native";
import { useEffect, useState } from "react";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileActions from "@/components/profile/ProfileActions";
import ProfileBio from "@/components/profile/ProfileBio";
import ProfileTabs from "@/components/profile/ProfileTabs";

import { getMe, getMyProfileImage } from "@/services/user.api";

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const [me, image] = await Promise.all([
      getMe(),
      getMyProfileImage(),
    ]);

    setUser(me);
    setProfileImage(image.profileImage);
  };

  if (!user) return null;

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
  <ProfileHeader
    username={user.username}
    profileImage={profileImage}
  />
  <ProfileBio user={user} />
  <ProfileActions isOwnProfile />
  
  <ProfileTabs userId={user._id} />
</ScrollView>

  );
}
