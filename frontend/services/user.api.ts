import api from "./api";
import * as SecureStore from "expo-secure-store";

/** Get full logged-in user */
export const getMe = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

/** Get logged-in user's profile image + username */
export const getMyProfileImage = async () => {
  const res = await api.get("/users/me/profile-image");
  return res.data;
};
