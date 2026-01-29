import api from "./api";
import * as SecureStore from "expo-secure-store";

export const getUserProfile = async (userId: string) => {
  const res = await api.get(`/users/${userId}`);
  return res.data;
};

export const getUserPosts = async (userId: string) => {
  const res = await api.get(`/post/user/${userId}`);
  return res.data;
};


export const updateBasicProfile = async (payload: {
  username?: string;
  firstName?: string;
  surname?: string;
  bio?: string;
  city?: string;
}) => {
  const res = await api.patch("/users/profile/basic", payload);
  return res.data;
};

// DOB + Gender
export const updateDobGender = async (payload: {
  dob: string;
  gender: string;
}) => {
  const res = await api.patch("/users/profile/dob-gender", payload);
  return res.data;
};

// Interests
export const updateInterests = async (interests: string[]) => {
  const res = await api.patch("/users/profile/interests", { interests });
  return res.data;
};

// Profile Image
export const updateProfileImage = async (formData: FormData) => {
  const token = await SecureStore.getItemAsync("accessToken");

  const res = await api.patch(
    "/users/profile/image", // ✅ CORRECT ROUTE
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`, // 🔥 FORCE TOKEN
        "Content-Type": "multipart/form-data",
      },
      transformRequest: () => formData, // 🔥 REQUIRED IN RN
    }
  );

  return res.data;
};
