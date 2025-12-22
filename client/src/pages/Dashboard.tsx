import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { StreakDisplay } from '@/components/dashboard/StreakDisplay';
import { UserProfileCard } from '@/components/dashboard/UserProfileCard';
import { TodayTaskItem } from '@/components/dashboard/TodayTaskItem';
import { RoadmapCard } from '@/components/dashboard/RoadmapCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { tasksApi, Task, RoadmapTask } from '@/services/api';
import { CalendarDays, Map, Loader2 } from 'lucide-react';

// Mock data for demonstration
const mockUser = {
  id: '1',
  name: 'Alex Developer',
  email: 'alex@example.com',
  skillLevel: 'intermediate' as const,
  goal: 'Full Stack',
  dailyTime: 60,
  currentStreak: 7,
  longestStreak: 14,
};

const mockTodayTasks: Task[] = [
  { id: '1', title: 'Complete React Hooks Tutorial', description: 'Learn useState and useEffect hooks', category: 'React', estimatedTime: 30, completed: false, order: 1 },
  { id: '2', title: 'Build a Todo List Component', description: 'Practice component composition', category: 'React', estimatedTime: 45, completed: true, order: 2 },
  { id: '3', title: 'Study TypeScript Generics', description: 'Understand generic types and constraints', category: 'TypeScript', estimatedTime: 25, completed: false, order: 3 },
];

const mockRoadmapTasks: RoadmapTask[] = [
  { id: '1', title: 'JavaScript Fundamentals', description: 'Master the core concepts of JavaScript including ES6+ features', phase: 'Phase 1', status: 'completed', tasks: [{ id: '1', title: '', description: '', category: '', estimatedTime: 0, completed: true, order: 1 }] },
  { id: '2', title: 'React Basics', description: 'Learn component-based architecture and React ecosystem', phase: 'Phase 2', status: 'in-progress', tasks: [{ id: '2', title: '', description: '', category: '', estimatedTime: 0, completed: true, order: 1 }, { id: '3', title: '', description: '', category: '', estimatedTime: 0, completed: false, order: 2 }] },
  { id: '3', title: 'State Management', description: 'Master Redux, Context API, and other state solutions', phase: 'Phase 3', status: 'available', tasks: [] },
  { id: '4', title: 'Backend Integration', description: 'Connect to APIs, handle authentication and data flow', phase: 'Phase 4', status: 'locked', tasks: [] },
];

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [roadmapTasks, setRoadmapTasks] = useState<RoadmapTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use mock data or fetch from API
  const user = authUser || mockUser;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In production, these would fetch from the API
        // const [todayRes, roadmapRes] = await Promise.all([
        //   tasksApi.getTodayTasks(),
        //   tasksApi.getRoadmapTasks(),
        // ]);
        // setTodayTasks(todayRes.data);
        // setRoadmapTasks(roadmapRes.data);
        
        // Using mock data for demo
        setTodayTasks(mockTodayTasks);
        setRoadmapTasks(mockRoadmapTasks);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTaskComplete = (taskId: string) => {
    setTodayTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
  };

  const completedToday = todayTasks.filter((t) => t.completed).length;
  const totalToday = todayTasks.length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, <span className="text-gradient">{user.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-muted-foreground">
            Keep up the momentum. You're on a {user.currentStreak}-day streak!
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - User Info & Streaks */}
          <div className="space-y-6">
            <UserProfileCard user={user} />
            <StreakDisplay
              currentStreak={user.currentStreak}
              longestStreak={user.longestStreak}
            />
          </div>

          {/* Middle Column - Today's Tasks */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Today's Tasks</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {completedToday} of {totalToday} completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-gradient">
                    {Math.round((completedToday / totalToday) * 100) || 0}%
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayTasks.map((task) => (
                  <TodayTaskItem
                    key={task.id}
                    task={task}
                    onComplete={handleTaskComplete}
                  />
                ))}
                {todayTasks.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No tasks for today. Check your roadmap!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Roadmap Section */}
        <section className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Map className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your Roadmap</h2>
              <p className="text-muted-foreground">
                Track your progress through structured learning phases
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {roadmapTasks.map((task, index) => (
              <RoadmapCard key={task.id} task={task} index={index} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
