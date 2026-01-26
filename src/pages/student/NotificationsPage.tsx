import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Search,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Calendar,
  Award,
  BookOpen,
  Filter,
  Trash2,
  Check,
  Settings,
  Zap,
} from "lucide-react";
import { format } from "date-fns";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "alert" | "info" | "success" | "warning" | "achievement";
  category: "attendance" | "activity" | "announcement" | "achievement" | "reminder";
  receivedAt: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Level Up! 🎉",
    message: "Congratulations! You've reached Level 16. Keep up the great work!",
    type: "achievement",
    category: "achievement",
    receivedAt: new Date(2024, 0, 15, 10, 30),
    read: false,
  },
  {
    id: "2",
    title: "Class Reminder",
    message: "Your Data Structures class starts in 30 minutes at Room 301.",
    type: "info",
    category: "reminder",
    receivedAt: new Date(2024, 0, 15, 9, 0),
    read: false,
  },
  {
    id: "3",
    title: "Attendance Recorded",
    message: "Your attendance for CS201 has been marked as present.",
    type: "success",
    category: "attendance",
    receivedAt: new Date(2024, 0, 14, 14, 15),
    read: true,
  },
  {
    id: "4",
    title: "New Activity Available",
    message: "A new coding challenge 'Binary Trees Mastery' is now available. Earn 100 XP!",
    type: "info",
    category: "activity",
    receivedAt: new Date(2024, 0, 14, 11, 0),
    read: true,
  },
  {
    id: "5",
    title: "Attendance Warning",
    message: "Your attendance in CS301 is at 76%. Maintain above 75% to avoid issues.",
    type: "warning",
    category: "attendance",
    receivedAt: new Date(2024, 0, 13, 16, 45),
    read: true,
  },
  {
    id: "6",
    title: "Badge Earned: Code Master",
    message: "You've completed 10 coding activities and earned the Code Master badge!",
    type: "achievement",
    category: "achievement",
    receivedAt: new Date(2024, 0, 12, 18, 20),
    read: true,
  },
  {
    id: "7",
    title: "Quiz Tomorrow",
    message: "Reminder: You have an Algorithms quiz tomorrow at 10:00 AM.",
    type: "alert",
    category: "announcement",
    receivedAt: new Date(2024, 0, 11, 15, 0),
    read: true,
  },
  {
    id: "8",
    title: "Streak Milestone",
    message: "Amazing! You've maintained a 10-day activity streak. +50 bonus XP!",
    type: "achievement",
    category: "achievement",
    receivedAt: new Date(2024, 0, 10, 20, 0),
    read: true,
  },
];

const notificationSettings = [
  { id: "attendance", label: "Attendance Updates", enabled: true },
  { id: "activities", label: "New Activities", enabled: true },
  { id: "achievements", label: "Achievements & Badges", enabled: true },
  { id: "reminders", label: "Class Reminders", enabled: true },
  { id: "announcements", label: "Announcements", enabled: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [settings, setSettings] = useState(notificationSettings);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || notification.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "achievement":
        return <Award className="h-5 w-5 text-warning" />;
      default:
        return <Info className="h-5 w-5 text-info" />;
    }
  };

  const getCategoryIcon = (category: Notification["category"]) => {
    switch (category) {
      case "attendance":
        return <Calendar className="h-4 w-4" />;
      case "activity":
        return <Zap className="h-4 w-4" />;
      case "achievement":
        return <Award className="h-4 w-4" />;
      case "announcement":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: Notification["type"]) => {
    switch (type) {
      case "alert":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Alert</Badge>;
      case "warning":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Warning</Badge>;
      case "success":
        return <Badge className="bg-success/10 text-success border-success/20">Success</Badge>;
      case "achievement":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Achievement</Badge>;
      default:
        return <Badge className="bg-info/10 text-info border-info/20">Info</Badge>;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with your activities, achievements, and announcements
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead} className="gap-2">
              <Check className="h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold text-destructive">{unreadCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold">
                  {notifications.filter((n) => n.category === "achievement").length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className="text-2xl font-bold">
                  {notifications.filter((n) => n.category === "attendance").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Notifications</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="attendance">Attendance</SelectItem>
                  <SelectItem value="activity">Activities</SelectItem>
                  <SelectItem value="achievement">Achievements</SelectItem>
                  <SelectItem value="announcement">Announcements</SelectItem>
                  <SelectItem value="reminder">Reminders</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notifications List */}
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="divide-y divide-border">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 transition-colors hover:bg-muted/50 ${
                          !notification.read ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5">{getTypeIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium">{notification.title}</h4>
                              {getTypeBadge(notification.type)}
                              {!notification.read && (
                                <span className="h-2 w-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                {getCategoryIcon(notification.category)}
                                {notification.category.charAt(0).toUpperCase() +
                                  notification.category.slice(1)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(notification.receivedAt, "MMM d, h:mm a")}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredNotifications.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No notifications found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Choose which notifications you want to receive.
                </p>
                <div className="space-y-4">
                  {settings.map((setting) => (
                    <div
                      key={setting.id}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-medium">{setting.label}</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about {setting.label.toLowerCase()}
                        </p>
                      </div>
                      <Switch
                        checked={setting.enabled}
                        onCheckedChange={() => toggleSetting(setting.id)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
