import { UserStats } from "@/types/activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, Flame, Trophy, Target, Clock } from "lucide-react";

interface XPProgressCardProps {
  userStats: UserStats;
  levelProgress: {
    current: number;
    required: number;
    percentage: number;
  };
}

export function XPProgressCard({ userStats, levelProgress }: XPProgressCardProps) {
  return (
    <Card className="shadow-card rounded-xl overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent p-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Your Progress</p>
            <h2 className="text-3xl font-bold font-display mt-1">Level {userStats.level}</h2>
          </div>
          <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
            <Star className="h-8 w-8" />
          </div>
        </div>
        
        {/* Level progress */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>XP to next level</span>
            <span className="font-medium">{levelProgress.current} / {levelProgress.required}</span>
          </div>
          <div className="h-3 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${levelProgress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/10">
            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Star className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userStats.totalXP.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-success/10">
            <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userStats.activitiesCompleted}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-info/10">
            <div className="h-10 w-10 rounded-full bg-info/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.floor(userStats.totalTimeSpent / 60)}h</p>
              <p className="text-xs text-muted-foreground">Time Spent</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
