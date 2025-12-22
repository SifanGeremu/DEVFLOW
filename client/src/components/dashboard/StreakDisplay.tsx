import { Flame, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card glow className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary animate-pulse-glow">
              <Flame className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-3xl font-bold tracking-tight">
                {currentStreak}
                <span className="text-lg font-normal text-muted-foreground ml-1">days</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent">
              <Trophy className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Longest Streak</p>
              <p className="text-3xl font-bold tracking-tight">
                {longestStreak}
                <span className="text-lg font-normal text-muted-foreground ml-1">days</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
