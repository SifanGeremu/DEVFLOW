import { User } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Clock, TrendingUp } from 'lucide-react';

interface UserProfileCardProps {
  user: User;
}

const skillLevelLabels = {
  beginner: { label: 'Beginner', color: 'text-success' },
  intermediate: { label: 'Intermediate', color: 'text-primary' },
  advanced: { label: 'Advanced', color: 'text-accent' },
};

export function UserProfileCard({ user }: UserProfileCardProps) {
  const skillConfig = skillLevelLabels[user.skillLevel] || skillLevelLabels.beginner;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-16 w-16 rounded-xl ring-2 ring-border object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-primary text-2xl font-bold text-primary-foreground">
              {user.name?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 rounded-lg bg-secondary/50">
            <TrendingUp className={`h-5 w-5 mb-1.5 ${skillConfig.color}`} />
            <span className="text-xs text-muted-foreground">Level</span>
            <span className={`text-sm font-medium ${skillConfig.color}`}>
              {skillConfig.label}
            </span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-lg bg-secondary/50">
            <Target className="h-5 w-5 mb-1.5 text-primary" />
            <span className="text-xs text-muted-foreground">Goal</span>
            <span className="text-sm font-medium text-foreground truncate max-w-full">
              {user.goal || 'Not set'}
            </span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-lg bg-secondary/50">
            <Clock className="h-5 w-5 mb-1.5 text-accent" />
            <span className="text-xs text-muted-foreground">Daily</span>
            <span className="text-sm font-medium text-foreground">
              {user.dailyTime}m
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
