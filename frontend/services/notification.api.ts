import api from "./api";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export const registerPushToken = async () => {
  try {
    if (!Device.isDevice) {
      console.log("Push notifications require physical device");
      return;
    }

    const { status } =
      await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      console.log("Push permission not granted");
      return;
    }

    const { data } =
      await Notifications.getExpoPushTokenAsync();

    await api.post("/users/push-token", { token: data });

    console.log("Push token registered:", data);

    return data;
  } catch (err) {
    console.log("Push registration error:", err);
  }
};
