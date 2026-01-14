import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8000";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const saveTokens = async (access: string, refresh: string) => {
    await SecureStore.setItemAsync("accessToken", access);
    await SecureStore.setItemAsync("refreshToken", refresh);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    setUser(null);
  };

  const restoreSession = async () => {
    const token = await SecureStore.getItemAsync("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch {
      await logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  return { user, setUser, saveTokens, logout, loading };
};
