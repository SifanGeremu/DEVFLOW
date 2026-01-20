import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

type Onboarding = {
  skillLevel?: string;
  techStack?: string[];
  dailyTime?: number;
  goal?: string;
  timeline?: number;
};

type AuthContextType = {
  user: any;
  setUser: (user: any) => void;
  onboarding: Onboarding;
  setOnboarding: (onboarding: Onboarding) => void;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [onboarding, setOnboarding] = useState<Onboarding>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/user/profile");
        setUser(res.data.user);

        // Fetch onboarding data for existing user
        if (res.data.user.onboardingId) {
          const ob = await api.get(`/onboarding/${res.data.user.onboardingId}`);
          setOnboarding(ob.data);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const signOut = async () => {
    await api.post("/auth/logout");
    setUser(null);
    setOnboarding({});
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, onboarding, setOnboarding, loading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export default useAuth;