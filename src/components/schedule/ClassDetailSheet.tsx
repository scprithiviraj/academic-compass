import { ScheduleClass } from "@/types/schedule";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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
  MapPin,
  User,
  BookOpen,
  CheckCircle2,
  Play,
  Circle,
  Calendar,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { dayNames } from "@/data/schedule";

interface ClassDetailSheetProps {
  classItem: ScheduleClass | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClassDetailSheet({
  classItem,
  isOpen,
  onClose,
}: ClassDetailSheetProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!classItem) return null;

  const getStatusBadge = () => {
    switch (classItem.status) {
      case "completed":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "ongoing":
        return (
          <Badge className="bg-primary text-primary-foreground">
            <Play className="h-3 w-3 mr-1" />
            Live Now
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Circle className="h-3 w-3 mr-1" />
            Upcoming
          </Badge>
        );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-start gap-3">
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl shrink-0",
              classItem.color ? `${classItem.color}/20` : "bg-primary/20"
            )}>
              <BookOpen className={cn(
                "h-6 w-6",
                classItem.color ? classItem.color.replace("bg-", "text-") : "text-primary"
              )} />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-xl">{classItem.subject}</SheetTitle>
              <SheetDescription className="mt-1">
                {getStatusBadge()}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Time & Schedule */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Schedule</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">
                    {classItem.startTime} - {classItem.endTime}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(
                      (parseInt(classItem.endTime.split(":")[0]) * 60 +
                        parseInt(classItem.endTime.split(":")[1]) -
                        (parseInt(classItem.startTime.split(":")[0]) * 60 +
                          parseInt(classItem.startTime.split(":")[1]))) / 60
                    )}{" "}
                    hour session
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{dayNames[classItem.day]}</p>
                  <p className="text-sm text-muted-foreground">Weekly</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Faculty & Location */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Details</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <User className="h-5 w-5 text-secondary" />
                <div>
                  <p className="font-medium">{classItem.faculty}</p>
                  <p className="text-sm text-muted-foreground">Faculty</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <MapPin className="h-5 w-5 text-info" />
                <div>
                  <p className="font-medium">{classItem.room}</p>
                  <p className="text-sm text-muted-foreground">Location</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />


          {/* Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/student/attendance')}
              >
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Attendance
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast({ title: "Coming Soon", description: "Course materials module is under development." })}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Materials
              </Button>
            </div>
          </div>

          {/* Attendance status */}
          {/* Attendance status */}
          {(classItem.attendanceStatus === 'PRESENT') && (
            <div className="rounded-xl border border-success/30 bg-success/10 p-4">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Attendance Marked</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                You were present for this class
              </p>
            </div>
          )}

          {classItem.attendanceStatus === 'ABSENT' && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
              <div className="flex items-center gap-2 text-destructive">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Absent</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                You were marked absent for this class
              </p>
            </div>
          )}

          {classItem.status === "ongoing" && (
            <Button className="w-full" size="lg">
              <ClipboardCheck className="h-5 w-5 mr-2" />
              Mark Attendance
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
