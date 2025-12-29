import { Quote, Clock, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import StreakBadge from "@/components/StreakBadge";
import ProgressRing from "@/components/ProgressRing";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const todaysTasks = [
  { id: 1, title: "Complete React hooks deep dive", duration: "45 min", status: "in-progress" as const },
  { id: 2, title: "Build a custom useLocalStorage hook", duration: "30 min", status: "pending" as const },
  { id: 3, title: "Review TypeScript generics", duration: "25 min", status: "pending" as const },
];

const recentActivity = [
  { id: 1, action: "Completed", item: "useState & useEffect patterns", time: "2 hours ago" },
  { id: 2, action: "Started", item: "React hooks deep dive", time: "3 hours ago" },
  { id: 3, action: "Achieved", item: "7-day streak 🔥", time: "Yesterday" },
];

const motivationalQuotes = [
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Consistency is more important than perfection.",
  "Small daily improvements lead to stunning results.",
  "The only way to do great work is to love what you do.",
];

const Dashboard = () => {
  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                Hey, cracked dev Sifan 👋
              </h1>
              <p className="text-muted-foreground">
                Ready to build some momentum today?
              </p>
            </div>
            <StreakBadge count={12} size="lg" />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Focus */}
            <section className="card-surface animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Today's Focus</h2>
                  <p className="text-sm text-muted-foreground">3 tasks • ~1h 40m total</p>
                </div>
                <Link to="/roadmap">
                  <Button variant="ghost" size="sm">
                    View all <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {todaysTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    duration={task.duration}
                    status={task.status}
                  />
                ))}
              </div>
            </section>

            {/* Recent Activity */}
            <section className="card-surface animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Clock size={14} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="text-muted-foreground">{activity.action}</span>{" "}
                        {activity.item}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <section className="card-surface text-center animate-fade-in" style={{ animationDelay: "0.15s" }}>
              <h2 className="text-lg font-semibold text-foreground mb-6">Roadmap Progress</h2>
              <div className="flex justify-center mb-4">
                <ProgressRing progress={42} size={140} strokeWidth={10} />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-2xl font-bold text-foreground">18</p>
                  <p className="text-xs text-muted-foreground">Tasks completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">25</p>
                  <p className="text-xs text-muted-foreground">Tasks remaining</p>
                </div>
              </div>
            </section>

            {/* Motivational Quote */}
            <section className="card-surface animate-fade-in" style={{ animationDelay: "0.25s" }}>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                  <Quote size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm text-foreground italic leading-relaxed">"{quote}"</p>
                </div>
              </div>
            </section>

            {/* Quick Stats */}
            <section className="card-surface animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <h2 className="text-lg font-semibold text-foreground mb-4">This Week</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Time invested</span>
                  <span className="font-medium text-foreground">4h 32m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tasks completed</span>
                  <span className="font-medium text-foreground">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current streak</span>
                  <span className="font-medium text-accent">12 days</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
