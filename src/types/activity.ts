export type ActivityCategory = "Coding" | "Skills" | "Reading" | "Projects" | "Research" | "Practice";
export type ActivityDifficulty = "Easy" | "Intermediate" | "Advanced";
export type ActivityStatus = "not_started" | "in_progress" | "completed";

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  difficulty: ActivityDifficulty;
  duration: number; // in minutes
  xp: number;
  skills: string[];
  steps: ActivityStep[];
  thumbnail?: string;
  featured?: boolean;
}

export interface ActivityStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface UserActivity {
  id: string;
  activityId: string;
  status: ActivityStatus;
  progress: number; // 0-100
  completedSteps: string[];
  startedAt?: Date;
  completedAt?: Date;
  xpEarned: number;
}

export interface UserStats {
  totalXP: number;
  level: number;
  activitiesCompleted: number;
  currentStreak: number;
  totalTimeSpent: number; // in minutes
}
