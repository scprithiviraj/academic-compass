import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { ActivityFilters } from "@/components/activities/ActivityFilters";
import { ActivityDetail } from "@/components/activities/ActivityDetail";
import { XPProgressCard } from "@/components/activities/XPProgressCard";
import { InProgressActivities } from "@/components/activities/InProgressActivities";
import { useActivities } from "@/hooks/useActivities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, BookOpen } from "lucide-react";

export default function ActivitiesPage() {
  const {
    filteredActivities,
    userStats,
    levelProgress,
    inProgressActivities,
    featuredActivities,
    categoryFilter,
    setCategoryFilter,
    difficultyFilter,
    setDifficultyFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    getUserActivity,
    getActivityWithProgress,
    startActivity,
    completeStep,
  } = useActivities();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  const { activity: selectedActivity, userActivity: selectedUserActivity } =
    selectedActivityId ? getActivityWithProgress(selectedActivityId) : { activity: undefined, userActivity: undefined };

  const handleViewActivity = (id: string) => setSelectedActivityId(id);
  const handleCloseDetail = () => setSelectedActivityId(null);

  const handleStartActivity = (id: string) => {
    startActivity(id);
    setSelectedActivityId(id);
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-fade-in">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              Activities
            </h1>
            <p className="text-muted-foreground mt-1">
              Build skills, earn XP, and track your learning progress
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* In Progress Section */}
            <div className="animate-fade-in stagger-1" style={{ opacity: 0 }}>
              <InProgressActivities
                activities={inProgressActivities}
                onContinue={handleViewActivity}
              />
            </div>

            {/* Featured Activities */}
            {featuredActivities.length > 0 && (
              <Card className="shadow-card rounded-xl animate-fade-in stagger-2" style={{ opacity: 0 }}>
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    Featured Activities
                  </CardTitle>
                  <CardDescription>Hand-picked activities to boost your skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredActivities.slice(0, 3).map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        userActivity={getUserActivity(activity.id)}
                        onStart={handleStartActivity}
                        onContinue={handleViewActivity}
                        onView={handleViewActivity}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Activities with Filters */}
            <Card className="shadow-card rounded-xl animate-fade-in stagger-3" style={{ opacity: 0 }}>
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Browse All Activities
                </CardTitle>
                <CardDescription>Explore our full library of learning activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ActivityFilters
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                  difficultyFilter={difficultyFilter}
                  setDifficultyFilter={setDifficultyFilter}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  resultCount={filteredActivities.length}
                />

                {filteredActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No activities match your filters</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting your search or filters
                    </p>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredActivities.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        userActivity={getUserActivity(activity.id)}
                        onStart={handleStartActivity}
                        onContinue={handleViewActivity}
                        onView={handleViewActivity}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredActivities.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        userActivity={getUserActivity(activity.id)}
                        onStart={handleStartActivity}
                        onContinue={handleViewActivity}
                        onView={handleViewActivity}
                        compact
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="animate-fade-in stagger-1" style={{ opacity: 0 }}>
              <XPProgressCard userStats={userStats} levelProgress={levelProgress} />
            </div>

            {/* Quick Stats */}
            <Card className="shadow-card rounded-xl animate-fade-in stagger-2" style={{ opacity: 0 }}>
              <CardHeader>
                <CardTitle className="font-display text-lg">Activity Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">All Time</span>
                  <Badge variant="secondary">{userStats.activitiesCompleted} activities</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Activity Detail Modal */}
      <ActivityDetail
        activity={selectedActivity}
        userActivity={selectedUserActivity}
        isOpen={!!selectedActivityId}
        onClose={handleCloseDetail}
        onStart={handleStartActivity}
        onCompleteStep={completeStep}
      />
    </DashboardLayout>
  );
}
