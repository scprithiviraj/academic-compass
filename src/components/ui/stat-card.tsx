import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "info";
  className?: string;
}

const variantStyles = {
  default: {
    card: "bg-card border border-border",
    icon: "bg-muted text-foreground",
  },
  primary: {
    card: "gradient-primary text-primary-foreground border-0",
    icon: "bg-white/20 text-white",
  },
  success: {
    card: "gradient-success text-success-foreground border-0",
    icon: "bg-white/20 text-white",
  },
  warning: {
    card: "bg-warning/10 border border-warning/20",
    icon: "bg-warning text-warning-foreground",
  },
  info: {
    card: "bg-info/10 border border-info/20",
    icon: "bg-info text-info-foreground",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];
  const isColoredVariant = variant === "primary" || variant === "success";

  return (
    <div
      className={cn(
        "rounded-xl p-6 shadow-card card-hover",
        styles.card,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p
            className={cn(
              "text-sm font-medium",
              isColoredVariant ? "text-white/80" : "text-muted-foreground"
            )}
          >
            {title}
          </p>
          <p className="text-3xl font-bold font-display tracking-tight">
            {value}
          </p>
          {description && (
            <p
              className={cn(
                "text-sm",
                isColoredVariant ? "text-white/70" : "text-muted-foreground"
              )}
            >
              {description}
            </p>
          )}
          {/* {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.isPositive
                  ? isColoredVariant
                    ? "text-white"
                    : "text-success"
                  : isColoredVariant
                  ? "text-white/80"
                  : "text-destructive"
              )}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span
                className={cn(
                  isColoredVariant ? "text-white/60" : "text-muted-foreground"
                )}
              >
                vs last week
              </span>
            </div>
          )} */}
        </div>
        <div className={cn("rounded-xl p-3", styles.icon)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
