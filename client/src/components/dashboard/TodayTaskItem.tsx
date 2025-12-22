import { useState } from 'react';
import { Check, Clock } from 'lucide-react';
import { Task, tasksApi } from '@/services/api';
import { cn } from '@/lib/utils';

interface TodayTaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
}

export function TodayTaskItem({ task, onComplete }: TodayTaskItemProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.completed);

  const handleComplete = async () => {
    if (isCompleted || isCompleting) return;
    
    setIsCompleting(true);
    try {
      await tasksApi.completeTask(task.id);
      setIsCompleted(true);
      onComplete(task.id);
    } catch (error) {
      console.error('Failed to complete task:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-4 p-4 rounded-xl border border-border bg-card transition-all duration-300",
        isCompleted && "opacity-60 bg-success/5 border-success/20",
        !isCompleted && "hover:border-primary/30 hover:bg-card/80"
      )}
    >
      <button
        onClick={handleComplete}
        disabled={isCompleting || isCompleted}
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200",
          isCompleted
            ? "border-success bg-success text-success-foreground"
            : "border-muted-foreground/30 hover:border-primary hover:bg-primary/10",
          isCompleting && "animate-pulse"
        )}
      >
        {isCompleted && <Check className="h-4 w-4" />}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-medium transition-all duration-200",
            isCompleted && "line-through text-muted-foreground"
          )}
        >
          {task.title}
        </p>
        <p className="text-sm text-muted-foreground truncate">{task.description}</p>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>{task.estimatedTime}m</span>
      </div>

      <span
        className={cn(
          "px-2.5 py-0.5 text-xs font-medium rounded-full",
          "bg-secondary text-secondary-foreground"
        )}
      >
        {task.category}
      </span>
    </div>
  );
}
