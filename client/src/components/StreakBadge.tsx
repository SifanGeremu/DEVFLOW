import { Flame } from "lucide-react";

interface StreakBadgeProps {
  count: number;
  size?: "sm" | "md" | "lg";
}

const StreakBadge = ({ count, size = "md" }: StreakBadgeProps) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <div
      className={`inline-flex items-center rounded-full bg-accent/10 border border-accent/20 text-accent font-medium ${sizeClasses[size]}`}
    >
      <Flame size={iconSizes[size]} className="text-accent" />
      <span>{count} day streak</span>
    </div>
  );
};

export default StreakBadge;
