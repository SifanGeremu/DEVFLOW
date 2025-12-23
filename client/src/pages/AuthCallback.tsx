import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = params.get("token"); // server JWT from backend
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // Login and wait for user fetch
    login(token)
      .then(() => {
        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        navigate("/login", { replace: true });
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
