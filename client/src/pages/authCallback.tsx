// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      return navigate("/?error=auth_failed");
    }

    // Save token locally
    localStorage.setItem("token", token);

    // Set default Authorization header for all API calls
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Redirect to onboarding or dashboard
    navigate("/onboarding");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Signing in...
    </div>
  );
};

export default AuthCallback;
