import { format, isToday } from "date-fns";
import { ScheduleClass } from "@/types/schedule";
import { weeklySchedule, dayNames } from "@/data/schedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  User,
  CheckCircle2,
  Play,
  Circle,
  Coffee,
  Sparkles,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DayScheduleListProps {
  selectedDate: Date;
  onClassClick: (classItem: ScheduleClass) => void;
  onFreePeriodClick: (classItem: ScheduleClass) => void;
}

export function DayScheduleList({
  selectedDate,
  onClassClick,
  onFreePeriodClick,
}: DayScheduleListProps) {
  const dayNum = selectedDate.getDay();
  const isWeekend = dayNum === 0 || dayNum === 6;

  const classes = weeklySchedule
    .filter((c) => c.day === dayNum)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "ongoing":
        return <Play className="h-4 w-4 text-primary" />;
      case "free":
        return <Coffee className="h-4 w-4 text-accent" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success/10 text-success border-success/30">Completed</Badge>;
      case "ongoing":
        return <Badge className="bg-primary text-primary-foreground">Live</Badge>;
      case "free":
        return <Badge variant="outline" className="border-accent text-accent">Free Period</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  if (isWeekend) {
    return (
      <Card className="shadow-card rounded-xl">
        <CardContent className="py-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-lg font-medium">{dayNames[dayNum]}</p>
          <p className="text-muted-foreground mt-1">No classes on weekends</p>
          <p className="text-sm text-muted-foreground mt-2">
            Enjoy your rest! 🎉
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card rounded-xl">
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {format(selectedDate, "EEEE, MMMM d")}
          </span>
          {isToday(selectedDate) && (
            <Badge variant="secondary">Today</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {classes.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No classes scheduled</p>
          </div>
        ) : (
          classes.map((classItem, index) => (
            <div
              key={classItem.id}
              onClick={() =>
                classItem.status === "free"
                  ? onFreePeriodClick(classItem)
                  : onClassClick(classItem)
              }
              className={cn(
                "flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all",
                classItem.status === "ongoing" && "border-primary bg-primary/5 ring-1 ring-primary/20",
                classItem.status === "completed" && "border-success/30 bg-success/5",
                classItem.status === "free" && "border-accent/30 bg-accent/5 border-dashed",
                classItem.status === "upcoming" && "border-border hover:border-primary/30 hover:bg-primary/5"
              )}
            >
              {/* Time indicator */}
              <div className="flex flex-col items-center w-16 shrink-0">
                <span className="text-sm font-medium">{classItem.startTime}</span>
                <div className="h-8 w-px bg-border my-1" />
                <span className="text-xs text-muted-foreground">{classItem.endTime}</span>
              </div>

              {/* Status icon */}
              <div className="shrink-0">
                {getStatusIcon(classItem.status)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate">{classItem.subject}</p>
                  {getStatusBadge(classItem.status)}
                </div>

                {classItem.status !== "free" ? (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {classItem.faculty}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {classItem.room}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-accent flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    Click to start an activity
                  </p>
                )}
              </div>

              {/* Action for free period */}
              {classItem.status === "free" && (
                <Button size="sm" variant="ghost" className="shrink-0 text-accent">
                  Start
                </Button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
