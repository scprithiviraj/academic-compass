import { useMemo } from "react";
import { format, startOfWeek, addDays, isSameDay, isToday } from "date-fns";
import { ScheduleClass } from "@/types/schedule";
import { timeSlots, shortDayNames } from "@/data/schedule";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  Play,
  Coffee,
  MapPin,
  User,
  Sparkles,
} from "lucide-react";

interface WeeklyCalendarProps {
  schedule: ScheduleClass[];
  selectedDate: Date;
  onClassClick: (classItem: ScheduleClass) => void;
  onFreePeriodClick: (classItem: ScheduleClass) => void;
}

export function WeeklyCalendar({
  schedule,
  selectedDate,
  onClassClick,
  onFreePeriodClick,
}: WeeklyCalendarProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)); // Mon-Sun
  }, [weekStart]);

  const getClassesForDay = (dayIndex: number): ScheduleClass[] => {
    const adjustedDay = dayIndex === 0 ? 7 : dayIndex; // Handle Sunday
    return schedule
      .filter((c) => c.day === adjustedDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "ongoing":
        return <Play className="h-3.5 w-3.5" />;
      case "free":
        return <Coffee className="h-3.5 w-3.5" />;
      default:
        return <Circle className="h-3.5 w-3.5" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "border-success/30 bg-success/5";
      case "ongoing":
        return "border-primary bg-primary/10 ring-2 ring-primary/20";
      case "free":
        return "border-accent/50 bg-accent/10 border-dashed";
      case "cancelled":
        return "border-destructive/30 bg-destructive/5 opacity-60";
      default:
        return "border-border bg-card hover:border-primary/30 hover:bg-primary/5";
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header with days */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day, index) => {
            const dayNum = day.getDay();
            const isCurrentDay = isToday(day);

            return (
              <div
                key={index}
                className={cn(
                  "text-center p-3 rounded-xl transition-all",
                  isCurrentDay
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50"
                )}
              >
                <p className="text-xs font-medium opacity-80">
                  {shortDayNames[dayNum]}
                </p>
                <p className="text-lg font-bold">{format(day, "d")}</p>
              </div>
            );
          })}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, dayIndex) => {
            const dayNum = day.getDay();
            const classes = getClassesForDay(dayNum);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={dayIndex}
                className={cn(
                  "space-y-2 p-2 rounded-xl min-h-[400px]",
                  isCurrentDay ? "bg-primary/5 ring-1 ring-primary/20" : "bg-muted/20"
                )}
              >
                {classes.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    No classes
                  </div>
                ) : (
                  classes.map((classItem) => (
                    <div
                      key={classItem.id}
                      onClick={() =>
                        classItem.status === "free"
                          ? onFreePeriodClick(classItem)
                          : onClassClick(classItem)
                      }
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all",
                        getStatusStyles(classItem.status)
                      )}
                    >
                      {/* Time */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {classItem.startTime} - {classItem.endTime}
                        </span>
                        <span className={cn(
                          "flex items-center gap-1",
                          classItem.status === "completed" && "text-success",
                          classItem.status === "ongoing" && "text-primary",
                          classItem.status === "free" && "text-accent"
                        )}>
                          {getStatusIcon(classItem.status)}
                        </span>
                      </div>

                      {/* Subject */}
                      <p className="font-medium text-sm line-clamp-2 mb-2">
                        {classItem.subject}
                      </p>

                      {/* Details */}
                      {classItem.status !== "free" ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span className="truncate">{classItem.faculty}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{classItem.room}</span>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-7 text-xs text-accent hover:text-accent hover:bg-accent/10"
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          Start Activity
                        </Button>
                      )}

                      {/* Status badge for ongoing */}
                      {classItem.status === "ongoing" && (
                        <Badge className="mt-2 bg-primary text-primary-foreground text-[10px]">
                          Live Now
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
