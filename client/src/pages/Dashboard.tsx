import { useEffect, useState } from "react";
import { Quote, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import StreakBadge from "@/components/StreakBadge";
import ProgressRing from "@/components/ProgressRing";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "./authContext";
import api from "@/lib/api";

const Dashboard = () => {
  const { user, onboarding, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      // Not logged in, redirect to landing
      navigate("/");
      return;
    }

    const loadDashboard = async () => {
      try {
        // Fetch today tasks
        const res = await api.get("/tasks/today");
        setTasks(res.data.tasks || []);
      } catch (err) {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user, authLoading]);

  if (authLoading || loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  // Calculate progress
  const completedCount = tasks.filter((t) => t.status === "done").length;
  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  // Default onboarding fallback
  const skillLevel = onboarding?.skillLevel || "beginner";
  const techStack = onboarding?.techStack || [];
  const dailyTime = onboarding?.dailyTime || 60;
  const goal = onboarding?.goal || "";
  const timeline = onboarding?.timeline || 8;

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Hey, {user?.name?.split(" ")[0] || "Developer"}
            </h1>
            <p className="text-gray-400">
              Recommended for {skillLevel} developers: {techStack.join(", ")}
            </p>
          </div>
          <StreakBadge count={user?.current_streak || 0} size="lg" />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-[#111111] rounded-xl p-6 shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Today’s Focus
                </h2>
                <Link to="/roadmap">
                  <Button variant="ghost" size="sm">
                    View roadmap <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <p className="text-gray-400">
                    No tasks today. Stay consistent.
                  </p>
                ) : (
                  tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      title={task.title}
                      duration={`${task.estimated_minutes} min`}
                      status={task.status}
                    />
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <section className="bg-[#111111] rounded-xl p-6 text-center shadow">
              <h2 className="text-lg font-semibold text-white">Progress</h2>
              <ProgressRing progress={progress} size={140} strokeWidth={10} />
              <p className="text-sm text-gray-400 mt-4">
                {completedCount} of {tasks.length} tasks completed
              </p>
            </section>

            {/* Quote */}
            <section className="bg-[#111111] rounded-xl p-6 shadow">
              <div className="flex gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#00ff9d]/10">
                  <Quote className="text-[#00ff9d]" size={20} />
                </div>
                <p className="text-sm italic text-white">
                  “Consistency beats intensity.”
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
