import { useState } from "react";
import { format, addWeeks, subWeeks, addMonths, subMonths, startOfWeek } from "date-fns";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WeeklyCalendar } from "@/components/schedule/WeeklyCalendar";
import { MonthlyCalendar } from "@/components/schedule/MonthlyCalendar";
import { DayScheduleList } from "@/components/schedule/DayScheduleList";
import { ClassDetailSheet } from "@/components/schedule/ClassDetailSheet";
import { FreePeriodSheet } from "@/components/schedule/FreePeriodSheet";
import { ScheduleClass } from "@/types/schedule";
import { weeklySchedule } from "@/data/schedule";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Coffee,
  Target,
} from "lucide-react";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [selectedClass, setSelectedClass] = useState<ScheduleClass | null>(null);
  const [selectedFreePeriod, setSelectedFreePeriod] = useState<ScheduleClass | null>(null);

  const handlePrevious = () => {
    if (viewMode === "week") {
      setSelectedDate(subWeeks(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === "week") {
      setSelectedDate(addWeeks(selectedDate, 1));
    } else {
      setSelectedDate(addMonths(selectedDate, 1));
    }
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setViewMode("week");
  };

  // Calculate stats
  const totalClasses = weeklySchedule.filter((c) => c.status !== "free").length;
  const freePeriods = weeklySchedule.filter((c) => c.status === "free").length;
  const totalHours = weeklySchedule.reduce((acc, c) => {
    const start = parseInt(c.startTime.split(":")[0]) * 60 + parseInt(c.startTime.split(":")[1]);
    const end = parseInt(c.endTime.split(":")[0]) * 60 + parseInt(c.endTime.split(":")[1]);
    return acc + (end - start);
  }, 0);

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-fade-in">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              My Schedule
            </h1>
            <p className="text-muted-foreground mt-1">
              View your classes and manage your time effectively
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-4 animate-fade-in stagger-1" style={{ opacity: 0 }}>
          <Card className="shadow-card rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalClasses}</p>
                <p className="text-xs text-muted-foreground">Classes/Week</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Coffee className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{freePeriods}</p>
                <p className="text-xs text-muted-foreground">Free Periods</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(totalHours / 60)}h</p>
                <p className="text-xs text-muted-foreground">Total Hours</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">94.5%</p>
                <p className="text-xs text-muted-foreground">Attendance</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar Section */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-card rounded-xl animate-fade-in stagger-2" style={{ opacity: 0 }}>
              <CardHeader className="pb-2">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Navigation */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handlePrevious}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={handleToday}>
                      Today
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNext}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <h2 className="font-semibold ml-2">
                      {viewMode === "week"
                        ? `Week of ${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "MMM d, yyyy")}`
                        : format(selectedDate, "MMMM yyyy")}
                    </h2>
                  </div>

                  {/* View Toggle */}
                  <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "week" | "month")}>
                    <TabsList>
                      <TabsTrigger value="week">Week</TabsTrigger>
                      <TabsTrigger value="month">Month</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === "week" ? (
                  <WeeklyCalendar
                    selectedDate={selectedDate}
                    onClassClick={setSelectedClass}
                    onFreePeriodClick={setSelectedFreePeriod}
                  />
                ) : (
                  <MonthlyCalendar
                    selectedDate={selectedDate}
                    onDayClick={handleDayClick}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Day Detail Sidebar */}
          <div className="space-y-4 animate-fade-in stagger-3" style={{ opacity: 0 }}>
            <DayScheduleList
              selectedDate={selectedDate}
              onClassClick={setSelectedClass}
              onFreePeriodClick={setSelectedFreePeriod}
            />

            {/* Upcoming Classes */}
            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <CardTitle className="font-display text-lg">This Week</CardTitle>
                <CardDescription>Quick overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Classes</span>
                  <Badge variant="secondary">{totalClasses}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Free Periods</span>
                  <Badge variant="outline" className="border-accent text-accent">
                    {freePeriods}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Study Hours</span>
                  <Badge variant="secondary">{Math.round(totalHours / 60)}h</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Detail Sheets */}
      <ClassDetailSheet
        classItem={selectedClass}
        isOpen={!!selectedClass}
        onClose={() => setSelectedClass(null)}
      />
      <FreePeriodSheet
        classItem={selectedFreePeriod}
        isOpen={!!selectedFreePeriod}
        onClose={() => setSelectedFreePeriod(null)}
      />
    </DashboardLayout>
  );
}
