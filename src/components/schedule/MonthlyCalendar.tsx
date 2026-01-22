import { useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ScheduleClass } from "@/types/schedule";
import { weeklySchedule, shortDayNames } from "@/data/schedule";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Coffee } from "lucide-react";

interface MonthlyCalendarProps {
  selectedDate: Date;
  onDayClick: (date: Date) => void;
}

export function MonthlyCalendar({ selectedDate, onDayClick }: MonthlyCalendarProps) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    let day = calendarStart;
    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [calendarStart, calendarEnd]);

  const getClassesForDay = (date: Date): ScheduleClass[] => {
    const dayNum = date.getDay();
    if (dayNum === 0 || dayNum === 6) return []; // Weekend
    return weeklySchedule.filter((c) => c.day === dayNum);
  };

  const getClassSummary = (classes: ScheduleClass[]) => {
    const total = classes.length;
    const freePeriods = classes.filter((c) => c.status === "free").length;
    return { total, freePeriods, regularClasses: total - freePeriods };
  };

  return (
    <div className="space-y-4">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, selectedDate);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const classes = getClassesForDay(day);
          const { total, freePeriods, regularClasses } = getClassSummary(classes);
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;

          return (
            <div
              key={index}
              onClick={() => !isWeekend && onDayClick(day)}
              className={cn(
                "min-h-[100px] p-2 rounded-lg border transition-all",
                isCurrentMonth ? "bg-card" : "bg-muted/30 opacity-50",
                isSelected && "ring-2 ring-primary border-primary",
                isTodayDate && !isSelected && "border-primary/50 bg-primary/5",
                !isWeekend && "cursor-pointer hover:border-primary/30",
                isWeekend && "bg-muted/50"
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isTodayDate && "text-primary font-bold",
                    !isCurrentMonth && "text-muted-foreground"
                  )}
                >
                  {format(day, "d")}
                </span>
                {isTodayDate && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    Today
                  </Badge>
                )}
              </div>

              {!isWeekend && total > 0 && (
                <div className="space-y-1">
                  {regularClasses > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-[10px] text-muted-foreground">
                        {regularClasses} class{regularClasses > 1 ? "es" : ""}
                      </span>
                    </div>
                  )}
                  {freePeriods > 0 && (
                    <div className="flex items-center gap-1 text-accent">
                      <Coffee className="h-3 w-3" />
                      <span className="text-[10px]">
                        {freePeriods} free
                      </span>
                    </div>
                  )}
                </div>
              )}

              {isWeekend && (
                <span className="text-[10px] text-muted-foreground">Weekend</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
