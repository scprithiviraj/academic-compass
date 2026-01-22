import { ActivityCategory, ActivityDifficulty, ActivityStatus } from "@/types/activity";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, LayoutGrid, List } from "lucide-react";

interface ActivityFiltersProps {
  categoryFilter: ActivityCategory | "all";
  setCategoryFilter: (value: ActivityCategory | "all") => void;
  difficultyFilter: ActivityDifficulty | "all";
  setDifficultyFilter: (value: ActivityDifficulty | "all") => void;
  statusFilter: ActivityStatus | "all";
  setStatusFilter: (value: ActivityStatus | "all") => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (value: "grid" | "list") => void;
  resultCount: number;
}

const categories: (ActivityCategory | "all")[] = [
  "all",
  "Coding",
  "Skills",
  "Reading",
  "Projects",
  "Research",
  "Practice",
];

const difficulties: (ActivityDifficulty | "all")[] = [
  "all",
  "Easy",
  "Intermediate",
  "Advanced",
];

const statuses: { value: ActivityStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function ActivityFilters({
  categoryFilter,
  setCategoryFilter,
  difficultyFilter,
  setDifficultyFilter,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  resultCount,
}: ActivityFiltersProps) {
  const hasActiveFilters =
    categoryFilter !== "all" ||
    difficultyFilter !== "all" ||
    statusFilter !== "all" ||
    searchQuery !== "";

  const clearFilters = () => {
    setCategoryFilter("all");
    setDifficultyFilter("all");
    setStatusFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search activities, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
        </div>

        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as ActivityCategory | "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={difficultyFilter} onValueChange={(v) => setDifficultyFilter(v as ActivityDifficulty | "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((diff) => (
              <SelectItem key={diff} value={diff}>
                {diff === "all" ? "All Levels" : diff}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ActivityStatus | "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}

        <span className="ml-auto text-sm text-muted-foreground">
          {resultCount} {resultCount === 1 ? "activity" : "activities"} found
        </span>
      </div>
    </div>
  );
}
