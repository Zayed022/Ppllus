import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { getMe } from "@/services/user.api";


interface AuthContextType {
  user: any;
  loading: boolean;
  setUser: (user: any) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");

      console.log("AUTH TOKEN:", token);

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const userData = await getMe();
      console.log("AUTH USER LOADED:", userData);

      setUser(userData);
    } catch (err) {
      console.log("Auth load error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    setUser(null);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
