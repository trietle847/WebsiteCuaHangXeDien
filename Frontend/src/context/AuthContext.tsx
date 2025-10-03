import { createContext, useContext, useEffect, useState } from "react";
import userApi from "../services/user.api";

type User = {
  username: string;
  first_name: string;
  last_name: string;
};

type AuthContextType = {
  userInfo: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  // Lấy user từ token khi load lại trang
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      (async () => {
        try {
          const response = await userApi.getInfoByUsername();
          setUserInfo(response.user);
        } catch (err) {
          console.error("Không lấy được user", err);
          sessionStorage.removeItem("token");
          setUserInfo(null);
        }
      })();
    }
  }, []);

  const login = async (token: string) => {
    sessionStorage.setItem("token", token);
    const response = await userApi.getInfoByUsername();
    setUserInfo(response.user);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
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
