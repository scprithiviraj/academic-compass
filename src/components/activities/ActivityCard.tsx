import { Activity, UserActivity } from "@/types/activity";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Star,
  Code,
  BookOpen,
  Target,
  Lightbulb,
  FileText,
  Wrench,
  Play,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface ActivityCardProps {
  activity: Activity;
  userActivity?: UserActivity;
  onStart: (id: string) => void;
  onContinue: (id: string) => void;
  onView: (id: string) => void;
  compact?: boolean;
}

const categoryIcons: Record<string, React.ElementType> = {
  Coding: Code,
  Skills: Target,
  Reading: BookOpen,
  Projects: Wrench,
  Research: Lightbulb,
  Practice: FileText,
};

const difficultyColors: Record<string, string> = {
  Easy: "bg-success/10 text-success border-success/30",
  Intermediate: "bg-warning/10 text-warning border-warning/30",
  Advanced: "bg-destructive/10 text-destructive border-destructive/30",
};

export function ActivityCard({
  activity,
  userActivity,
  onStart,
  onContinue,
  onView,
  compact = false,
}: ActivityCardProps) {
  const CategoryIcon = categoryIcons[activity.category] || Target;
  const status = userActivity?.status || "not_started";
  const progress = userActivity?.progress || 0;

  if (compact) {
    return (
      <div
        onClick={() => onView(activity.id)}
        className="group flex items-center gap-4 rounded-xl border border-border p-4 transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 shrink-0">
          <CategoryIcon className="h-6 w-6 text-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium group-hover:text-primary transition-colors truncate">
            {activity.title}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {activity.category}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {activity.durationMinutes} min
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 text-accent font-medium">
            <Star className="h-4 w-4" />
            <span>+{activity.xp} XP</span>
          </div>
          {status === "in_progress" && (
            <span className="text-xs text-muted-foreground">{progress}%</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/30">
      <CardContent className="p-0">
        {/* Header with category icon */}
        <div className="relative h-32 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <CategoryIcon className="h-16 w-16 text-primary/30" />

          {/* Status badge */}
          {status === "completed" && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-success text-success-foreground">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            </div>
          )}
          {status === "in_progress" && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-primary text-primary-foreground">
                <Play className="h-3 w-3 mr-1" />
                In Progress
              </Badge>
            </div>
          )}

          {/* XP badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-accent/90 text-accent-foreground">
              <Star className="h-3 w-3 mr-1" />
              {activity.xp} XP
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Title and description */}
          <div>
            <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
              {activity.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {activity.description}
            </p>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {activity.category}
            </Badge>
            <Badge variant="outline" className={`text-xs ${difficultyColors[activity.difficulty]}`}>
              {activity.difficulty}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
              <Clock className="h-3 w-3" />
              {activity.durationMinutes} min
            </span>
          </div>

          {/* Skills */}
          <div className="flex gap-1.5 flex-wrap">
            {activity.skills?.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {skill}
              </span>
            ))}
            {activity.skills && activity.skills.length > 3 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                +{activity.skills.length - 3}
              </span>
            )}
          </div>

          {/* Progress bar for in-progress */}
          {status === "in_progress" && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Action button */}
          <div className="pt-2">
            {status === "not_started" && (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onStart(activity.id);
                }}
                className="w-full"
                size="sm"
              >
                Start Activity
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {status === "in_progress" && (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onContinue(activity.id);
                }}
                className="w-full"
                size="sm"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {status === "completed" && (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onView(activity.id);
                }}
                variant="outline"
                className="w-full"
                size="sm"
              >
                View Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
