import { Activity, UserActivity } from "@/types/activity";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Play } from "lucide-react";

interface InProgressActivitiesProps {
  activities: Array<UserActivity & { activity: Activity }>;
  onContinue: (id: string) => void;
}

export function InProgressActivities({ activities, onContinue }: InProgressActivitiesProps) {
  if (activities.length === 0) {
    return (
      <Card className="shadow-card rounded-xl">
        <CardContent className="py-8 text-center">
          <Play className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">No activities in progress</p>
          <p className="text-sm text-muted-foreground mt-1">
            Start a new activity to begin learning!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card rounded-xl">
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <Play className="h-5 w-5 text-primary" />
          Continue Learning
        </CardTitle>
        <CardDescription>Pick up where you left off</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map(({ activity, ...userActivity }) => (
          <div
            key={userActivity.id}
            className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{activity.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {activity.category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.duration} min
                </span>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{userActivity.progress}%</span>
                </div>
                <Progress value={userActivity.progress} className="h-2" />
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => onContinue(activity.id)}
              className="shrink-0"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
