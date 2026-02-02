import { useState, useEffect } from "react";
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
import notificationService, { AppNotification } from "@/services/NotificationService";
import { useToast } from "@/hooks/use-toast";

interface Notification extends AppNotification {
  receivedAt: Date;
}

const notificationSettings = [
  { id: "attendance", label: "Attendance Updates", enabled: true },
  { id: "activities", label: "New Activities", enabled: true },
  { id: "achievements", label: "Achievements & Badges", enabled: true },
  { id: "reminders", label: "Class Reminders", enabled: true },
  { id: "announcements", label: "Announcements", enabled: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [settings, setSettings] = useState(notificationSettings);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getUserNotifications();
      const mapped = data.map((n) => ({
        ...n,
        receivedAt: n.sentAt ? new Date(n.sentAt) : new Date(),
        category: (n.category || "system"),
        type: (n.type || "info"),
      }));
      setNotifications(mapped);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || notification.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
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

  const getCategoryIcon = (category: string) => {
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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "alert":
        return <Badge variant="destructive">Alert</Badge>;
      case "warning":
        return <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">Warning</Badge>;
      case "success":
        return <Badge className="bg-success text-success-foreground hover:bg-success/90">Success</Badge>;
      case "achievement":
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Achievement</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to mark as read",
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast({
        title: "Success",
        description: "All marked as read",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to mark all as read",
        variant: "destructive",
      });
    }
  };

  const deleteNotification = async (id: number) => {
    // For student, this strictly hides it locally for now
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast({
      title: "Notification removed",
      description: "Notification hidden from view",
    });
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
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-500" />
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
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-500" />
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
                  {loading ? (
                    <div className="flex justify-center items-center h-40">
                      <p className="text-muted-foreground">Loading notifications...</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 transition-colors hover:bg-muted/50 ${!notification.read ? "bg-primary/5" : ""
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
                                  title="Mark as read"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => deleteNotification(notification.id)}
                                title="Remove"
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
                  )}
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
