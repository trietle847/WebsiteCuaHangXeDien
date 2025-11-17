import { createContext, useContext, useEffect, useState } from "react";
import userApi from "../services/user.api";
import type { User } from "../lib/types";

type AuthContextType = {
  userInfo: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Thêm loading state

  // Lấy user từ token khi load lại trang
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        try {
          const response = await userApi.getInfoByUsername();
          setUserInfo(response.data);
        } catch (err) {
          console.error("Không lấy được user", err);
          localStorage.removeItem("token");
          setUserInfo(null);
        } finally {
          setLoading(false); // Xong rồi mới cho render
        }
      })();
    } else {
      setLoading(false); // Không có token thì cũng xong loading
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    const response = await userApi.getInfoByUsername();
    setUserInfo(response.data);
    setLoading(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được dùng trong AuthProvider");
  }
  return context;
};
