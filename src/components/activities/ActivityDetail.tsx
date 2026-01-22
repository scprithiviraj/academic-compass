import { Activity, UserActivity } from "@/types/activity";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
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
  Trophy,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityDetailProps {
  activity: Activity | undefined;
  userActivity: UserActivity | undefined;
  isOpen: boolean;
  onClose: () => void;
  onStart: (id: string) => void;
  onCompleteStep: (activityId: string, stepId: string) => void;
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

export function ActivityDetail({
  activity,
  userActivity,
  isOpen,
  onClose,
  onStart,
  onCompleteStep,
}: ActivityDetailProps) {
  if (!activity) return null;

  const CategoryIcon = categoryIcons[activity.category] || Target;
  const status = userActivity?.status || "not_started";
  const progress = userActivity?.progress || 0;
  const completedSteps = userActivity?.completedSteps || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <CategoryIcon className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-display">
                {activity.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="outline">{activity.category}</Badge>
                <Badge variant="outline" className={difficultyColors[activity.difficulty]}>
                  {activity.difficulty}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {activity.duration} min
                </span>
                <span className="text-sm font-medium flex items-center gap-1 text-accent">
                  <Star className="h-3.5 w-3.5" />
                  {activity.xp} XP
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          <div>
            <h4 className="font-medium mb-2">About this activity</h4>
            <p className="text-muted-foreground">{activity.description}</p>
          </div>

          {/* Skills */}
          <div>
            <h4 className="font-medium mb-2">Skills you'll learn</h4>
            <div className="flex gap-2 flex-wrap">
              {activity.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Progress section */}
          {status !== "not_started" && (
            <div className="rounded-xl border border-border p-4 bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium flex items-center gap-2">
                  {status === "completed" ? (
                    <>
                      <Trophy className="h-5 w-5 text-accent" />
                      Activity Completed!
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 text-primary" />
                      Your Progress
                    </>
                  )}
                </h4>
                <span className="text-lg font-bold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              {status === "completed" && userActivity && (
                <p className="text-sm text-muted-foreground mt-2">
                  You earned <span className="font-medium text-accent">{userActivity.xpEarned} XP</span> for completing this activity!
                </p>
              )}
            </div>
          )}

          {/* Steps */}
          <div>
            <h4 className="font-medium mb-3">
              Steps ({completedSteps.length}/{activity.steps.length})
            </h4>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {activity.steps.map((step, index) => {
                  const isCompleted = completedSteps.includes(step.id);
                  const isLocked = status === "not_started";
                  const canComplete = status === "in_progress" && !isCompleted;

                  return (
                    <motion.div
                      key={step.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-start gap-3 rounded-lg border p-4 transition-all ${
                        isCompleted
                          ? "border-success/30 bg-success/5"
                          : isLocked
                          ? "border-border bg-muted/30 opacity-60"
                          : "border-border hover:border-primary/30 hover:bg-primary/5"
                      }`}
                    >
                      <div className="pt-0.5">
                        {canComplete ? (
                          <Checkbox
                            checked={isCompleted}
                            onCheckedChange={() => onCompleteStep(activity.id, step.id)}
                            className="h-5 w-5"
                          />
                        ) : (
                          <div
                            className={`h-5 w-5 rounded-full flex items-center justify-center ${
                              isCompleted ? "bg-success" : "bg-muted border-2 border-border"
                            }`}
                          >
                            {isCompleted && <CheckCircle2 className="h-4 w-4 text-success-foreground" />}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                          Step {index + 1}: {step.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            {status === "not_started" && (
              <Button onClick={() => onStart(activity.id)} className="flex-1" size="lg">
                <Play className="h-4 w-4 mr-2" />
                Start Activity
              </Button>
            )}
            {status === "in_progress" && (
              <div className="flex-1 text-center text-sm text-muted-foreground">
                Complete the steps above to finish this activity
              </div>
            )}
            {status === "completed" && (
              <div className="flex-1 flex items-center justify-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">All steps completed!</span>
              </div>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
