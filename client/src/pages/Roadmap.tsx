import { Check, Clock, Play, Lock } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

interface RoadmapTask {
  id: number;
  title: string;
  description: string;
  duration: string;
  status: "completed" | "in-progress" | "pending" | "locked";
  week: number;
}

const roadmapTasks: RoadmapTask[] = [
  { id: 1, title: "Introduction to React", description: "Understand React fundamentals and JSX", duration: "30 min", status: "completed", week: 1 },
  { id: 2, title: "Components & Props", description: "Learn how to build reusable components", duration: "45 min", status: "completed", week: 1 },
  { id: 3, title: "State Management Basics", description: "useState and lifting state up", duration: "40 min", status: "completed", week: 1 },
  { id: 4, title: "React Hooks Deep Dive", description: "Master useEffect, useCallback, useMemo", duration: "45 min", status: "in-progress", week: 2 },
  { id: 5, title: "Custom Hooks", description: "Build your own reusable hooks", duration: "30 min", status: "pending", week: 2 },
  { id: 6, title: "TypeScript Generics", description: "Type-safe components and functions", duration: "25 min", status: "pending", week: 2 },
  { id: 7, title: "Context API", description: "Global state without prop drilling", duration: "35 min", status: "pending", week: 3 },
  { id: 8, title: "React Query Basics", description: "Server state management made easy", duration: "50 min", status: "locked", week: 3 },
  { id: 9, title: "Forms & Validation", description: "React Hook Form and Zod", duration: "45 min", status: "locked", week: 3 },
  { id: 10, title: "Testing Components", description: "Unit testing with Jest and RTL", duration: "60 min", status: "locked", week: 4 },
  { id: 11, title: "Performance Optimization", description: "Memoization and lazy loading", duration: "40 min", status: "locked", week: 4 },
  { id: 12, title: "Build Your Project", description: "Apply everything in a real project", duration: "3 hours", status: "locked", week: 4 },
];

const weeks = [...new Set(roadmapTasks.map((t) => t.week))];

const getStatusIcon = (status: RoadmapTask["status"]) => {
  switch (status) {
    case "completed":
      return <Check size={16} />;
    case "in-progress":
      return <Play size={14} />;
    case "pending":
      return <Clock size={14} />;
    case "locked":
      return <Lock size={14} />;
  }
};

const getStatusStyles = (status: RoadmapTask["status"]) => {
  switch (status) {
    case "completed":
      return {
        card: "border-accent/30 bg-card opacity-70",
        icon: "bg-accent/20 text-accent",
        title: "text-muted-foreground line-through",
      };
    case "in-progress":
      return {
        card: "border-accent/50 bg-accent/5 glow-accent",
        icon: "bg-accent text-accent-foreground",
        title: "text-foreground",
      };
    case "pending":
      return {
        card: "border-border bg-card hover:bg-card-hover",
        icon: "bg-muted text-muted-foreground",
        title: "text-foreground",
      };
    case "locked":
      return {
        card: "border-border/50 bg-card/50 opacity-50",
        icon: "bg-muted text-muted-foreground",
        title: "text-muted-foreground",
      };
  }
};

const Roadmap = () => {
  const completedCount = roadmapTasks.filter((t) => t.status === "completed").length;
  const totalCount = roadmapTasks.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Your Roadmap</h1>
              <p className="text-muted-foreground">React Mastery • 8 week program</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{progressPercent}%</p>
                <p className="text-xs text-muted-foreground">{completedCount} of {totalCount} tasks</p>
              </div>
              <div className="w-24">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Timeline */}
        <div className="relative space-y-12">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border lg:left-6" />

          {weeks.map((week, weekIndex) => {
            const weekTasks = roadmapTasks.filter((t) => t.week === week);

            return (
              <section
                key={week}
                className="relative animate-fade-in"
                style={{ animationDelay: `${weekIndex * 0.1}s` }}
              >
                {/* Week marker */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-8 w-8 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-muted border border-border z-10">
                    <span className="text-sm font-semibold text-foreground lg:text-base">{week}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Week {week}</h2>
                    <p className="text-sm text-muted-foreground">
                      {weekTasks.filter((t) => t.status === "completed").length} of {weekTasks.length} completed
                    </p>
                  </div>
                </div>

                {/* Tasks */}
                <div className="ml-12 lg:ml-16 space-y-3">
                  {weekTasks.map((task) => {
                    const styles = getStatusStyles(task.status);
                    return (
                      <div
                        key={task.id}
                        className={`flex items-center justify-between rounded-xl border p-4 transition-all duration-200 ${styles.card}`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${styles.icon}`}
                          >
                            {getStatusIcon(task.status)}
                          </div>
                          <div>
                            <h3 className={`font-medium ${styles.title}`}>{task.title}</h3>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                              <Clock size={12} />
                              <span>{task.duration}</span>
                            </div>
                          </div>
                        </div>
                        {task.status === "in-progress" && (
                          <Button variant="accent" size="sm">
                            Continue
                          </Button>
                        )}
                        {task.status === "pending" && (
                          <Button variant="default" size="sm">
                            Start
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Roadmap;
