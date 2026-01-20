// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // Save JWT to localStorage
      localStorage.setItem("token", token);

      // Optional: quick check if profile exists (call your /user/profile endpoint)
      fetch("http://localhost:3000/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.profile_complete === 1) {
            // Already onboarded → go to dashboard
            navigate("/dashboard");
          } else {
            // New or incomplete → onboarding
            navigate("/onboarding");
          }
        })
        .catch(() => {
          // Fallback: go to onboarding if check fails
          navigate("/onboarding");
        });
    } else {
      // No token → error, go back to landing
      navigate("/");
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-muted-foreground">Authenticating...</p>
    </div>
  );
}
