export type ActivityCategory = "Coding" | "Skills" | "Reading" | "Projects" | "Research" | "Practice";
export type ActivityDifficulty = "Easy" | "Intermediate" | "Advanced";
export type ActivityStatus = "not_started" | "in_progress" | "completed";

export interface Activity {
  id: string; // Backend uses Long activityId, we might need mapping or just use string
  activityId?: number; // Added to help mapping
  title: string;
  description: string;
  category: string; // Backend is String
  difficulty: string; // Backend is String (Beginner, Intermediate, Advanced)
  durationMinutes: number;
  xp: number;
  totalSteps?: number;

  // Frontend specific or optional
  skills?: string[];
  steps?: ActivityStep[];
  thumbnail?: string;
  featured?: boolean;
  departmentId?: number;
  isActive?: boolean;
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
  xpForNextLevel?: number;
  xpProgressPercentage?: number;
}
