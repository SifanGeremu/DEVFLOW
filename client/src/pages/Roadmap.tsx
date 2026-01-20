import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "./authContext";
import api from "@/lib/api";
import TaskCard from "@/components/TaskCard";

const Roadmap = () => {
  const { onboarding, user } = useAuth();
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        // Check if user already has roadmap
        const res = await api.get("api/tasks", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setRoadmap(res.data.tasks || []);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load roadmap");
      } finally {
        setLoading(false);
      }
    };

    loadRoadmap();
  }, []);

  const handleStartTask = async (taskId: string) => {
    try {
      await api.post(`/tasks/${taskId}/start`);
      setRoadmap((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: "in-progress" } : t,
        ),
      );
    } catch (err) {
      console.error("Failed to start task", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading roadmap…
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  if (!roadmap.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>No roadmap found. Complete onboarding to generate one.</p>
        <Button onClick={() => navigate("/onboarding")}>
          Go to Onboarding
        </Button>
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">
            {user?.name?.split(" ")[0] || "Developer"}'s Roadmap
          </h1>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            Back to Dashboard <ArrowRight size={16} />
          </Button>
        </header>

        <div className="grid gap-6">
          {roadmap.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              duration={`${task.estimated_minutes} min`}
              status={task.status}
              onStart={() => handleStartTask(task.id)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Roadmap;
