import { Clock, Play, Check } from "lucide-react";
import { Button } from "./ui/button";

interface TaskCardProps {
  title: string;
  duration: string;
  status: "pending" | "in-progress" | "completed";
  onStart?: () => void;
}

const TaskCard = ({ title, duration, status, onStart }: TaskCardProps) => {
  const statusStyles = {
    pending: "border-border bg-card",
    "in-progress": "border-accent/50 bg-accent/5 glow-accent",
    completed: "border-accent/30 bg-card opacity-60",
  };

  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-4 transition-all duration-200 hover:bg-card-hover ${statusStyles[status]}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            status === "completed"
              ? "bg-accent/20 text-accent"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {status === "completed" ? <Check size={16} /> : <Play size={14} />}
        </div>
        <div>
          <h4
            className={`font-medium ${
              status === "completed"
                ? "text-muted-foreground line-through"
                : "text-foreground"
            }`}
          >
            {title}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>{duration}</span>
          </div>
        </div>
      </div>
      {status !== "completed" && (
        <Button
          variant={status === "in-progress" ? "accent" : "default"}
          size="sm"
          onClick={onStart}
        >
          {status === "in-progress" ? "Continue" : "Start"}
        </Button>
      )}
    </div>
  );
};

export default TaskCard;
