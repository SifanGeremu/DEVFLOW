import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { userApi } from "@/services/api";

interface AuthContextType {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  login: (serverToken: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await userApi.getProfile();
      setUser(res.data);
    } catch (err) {
      console.error("Auth error, logging out:", err);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchUser();
  }, [token]);

  const login = async (serverToken: string) => {
    localStorage.setItem("token", serverToken); // save server JWT
    setToken(serverToken);
    await fetchUser(); // fetch user immediately
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    setIsLoading(true);
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout: handleLogout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
