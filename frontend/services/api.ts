import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://10.218.18.100:8000/api/v1",
  timeout: 15000,
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❌ DO NOT intercept refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/users/refresh")
    ) {
      originalRequest._retry = true;

      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (!refreshToken) {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${api.defaults.baseURL}/users/refresh`,
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        await SecureStore.setItemAsync("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
