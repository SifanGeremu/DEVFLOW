import { Lock, Play, CheckCircle2, Circle } from 'lucide-react';
import { RoadmapTask } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RoadmapCardProps {
  task: RoadmapTask;
  index: number;
}

const statusConfig = {
  locked: {
    icon: Lock,
    label: 'Locked',
    color: 'text-muted-foreground',
    bg: 'bg-muted/50',
  },
  available: {
    icon: Circle,
    label: 'Available',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  'in-progress': {
    icon: Play,
    label: 'In Progress',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  completed: {
    icon: CheckCircle2,
    label: 'Completed',
    color: 'text-success',
    bg: 'bg-success/10',
  },
};

export function RoadmapCard({ task, index }: RoadmapCardProps) {
  const config = statusConfig[task.status];
  const StatusIcon = config.icon;
  const completedCount = task.tasks.filter(t => t.completed).length;
  const totalCount = task.tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card
      glow={task.status === 'available' || task.status === 'in-progress'}
      className={cn(
        "animate-fade-up overflow-hidden",
        task.status === 'locked' && "opacity-60"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", config.bg)}>
              <StatusIcon className={cn("h-5 w-5", config.color)} />
            </div>
            <div>
              <CardTitle className="text-base">{task.title}</CardTitle>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mt-0.5">
                {task.phase}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "shrink-0 px-2.5 py-1 text-xs font-medium rounded-full",
              config.bg,
              config.color
            )}
          >
            {config.label}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
        
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-mono text-foreground">{completedCount}/{totalCount}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                task.status === 'completed' ? "bg-success" : "bg-gradient-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
