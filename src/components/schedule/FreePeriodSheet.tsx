import { ScheduleClass } from "@/types/schedule";
import { Activity } from "@/types/activity";
import { activitiesData } from "@/data/activities";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Coffee,
  Star,
  ArrowRight,
  Sparkles,
  Code,
  BookOpen,
  Target,
  Lightbulb,
  FileText,
  Wrench,
} from "lucide-react";
import { dayNames } from "@/data/schedule";
import { useNavigate } from "react-router-dom";

interface FreePeriodSheetProps {
  classItem: ScheduleClass | null;
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  Coding: Code,
  Skills: Target,
  Reading: BookOpen,
  Projects: Wrench,
  Research: Lightbulb,
  Practice: FileText,
};

export function FreePeriodSheet({
  classItem,
  isOpen,
  onClose,
}: FreePeriodSheetProps) {
  const navigate = useNavigate();

  if (!classItem) return null;

  // Calculate free period duration in minutes
  const startMinutes =
    parseInt(classItem.startTime.split(":")[0]) * 60 +
    parseInt(classItem.startTime.split(":")[1]);
  const endMinutes =
    parseInt(classItem.endTime.split(":")[0]) * 60 +
    parseInt(classItem.endTime.split(":")[1]);
  const durationMinutes = endMinutes - startMinutes;

  // Get activities that fit within the free period duration
  const suggestedActivities = activitiesData
    .filter((a) => a.durationMinutes <= durationMinutes)
    .slice(0, 4);

  const handleStartActivity = (activityId: string) => {
    navigate(`/student/activities?start=${activityId}`);
    onClose();
  };

  const handleBrowseAll = () => {
    navigate("/student/activities");
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 shrink-0">
              <Coffee className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-xl">Free Period</SheetTitle>
              <SheetDescription className="mt-1">
                <Badge variant="outline" className="border-accent text-accent">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {Math.round(durationMinutes / 60 * 10) / 10}h available
                </Badge>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Time Info */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20">
            <Clock className="h-5 w-5 text-accent" />
            <div>
              <p className="font-medium">
                {classItem.startTime} - {classItem.endTime}
              </p>
              <p className="text-sm text-muted-foreground">
                {dayNames[classItem.day]} • {durationMinutes} minutes
              </p>
            </div>
          </div>

          <Separator />

          {/* Suggested Activities */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              Suggested Activities
            </h4>

            <div className="rounded-xl border border-dashed border-muted-foreground/30 bg-muted/10 p-6 flex flex-col items-center justify-center text-center">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm">Coming Soon</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                Personalized activity suggestions based on your interests are on the way!
              </p>
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex-col h-auto py-4"
                onClick={handleBrowseAll}
              >
                <BookOpen className="h-5 w-5 mb-1" />
                <span className="text-xs">Browse Activities</span>
              </Button>
            </div>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}
