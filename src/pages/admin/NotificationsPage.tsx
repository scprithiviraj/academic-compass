import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bell,
  Send,
  Plus,
  Search,
  Filter,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Info,
  Megaphone,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import notificationService from "@/services/NotificationService";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "announcement" | "alert" | "reminder" | "info";
  audience: "all" | "students" | "faculty" | "admins";
  status: "sent" | "scheduled" | "draft";
  sentAt?: string;
  scheduledFor?: string;
  readCount?: number;
  totalRecipients?: number;
}

const notificationsData: Notification[] = [
  {
    id: 1,
    title: "Semester Registration Open",
    message: "Spring 2025 semester registration is now open. Please complete your registration by January 31st.",
    type: "announcement",
    audience: "students",
    status: "sent",
    sentAt: "2025-01-20T10:00:00",
    readCount: 2456,
    totalRecipients: 2847,
  },
  {
    id: 2,
    title: "Low Attendance Alert",
    message: "15 students have attendance below 75% this week. Immediate attention required.",
    type: "alert",
    audience: "faculty",
    status: "sent",
    sentAt: "2025-01-19T09:00:00",
    readCount: 142,
    totalRecipients: 156,
  },
  {
    id: 3,
    title: "System Maintenance",
    message: "Scheduled maintenance on January 27th from 2 AM to 6 AM. System will be temporarily unavailable.",
    type: "info",
    audience: "all",
    status: "scheduled",
    scheduledFor: "2025-01-26T18:00:00",
  },
  {
    id: 4,
    title: "Faculty Meeting Reminder",
    message: "Monthly faculty meeting scheduled for January 28th at 3 PM in Conference Room A.",
    type: "reminder",
    audience: "faculty",
    status: "sent",
    sentAt: "2025-01-18T14:00:00",
    readCount: 148,
    totalRecipients: 156,
  },
  {
    id: 5,
    title: "New Activity: Python Workshop",
    message: "A new Python programming workshop has been added. Check your activities page for details.",
    type: "announcement",
    audience: "students",
    status: "draft",
  },
];

const typeIcons = {
  announcement: Megaphone,
  alert: AlertTriangle,
  reminder: Clock,
  info: Info,
};

const typeColors = {
  announcement: "bg-primary text-primary-foreground",
  alert: "bg-destructive text-destructive-foreground",
  reminder: "bg-warning text-warning-foreground",
  info: "bg-info text-info-foreground",
};

const statusColors = {
  sent: "bg-success",
  scheduled: "bg-warning",
  draft: "bg-muted",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "announcement" as const,
    audience: "all" as const,
    sendNow: true,
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Use the admin endpoint to get everything
      const data = await notificationService.getAllNotifications();
      // Backend might return slightly different fields, ensuring compatibility
      const mapped = data.map((n: any) => ({
        ...n,
        // Backend DTO might not strictly set status to 'sent', so we default if missing
        status: n.status || 'sent',
        audience: n.audience || 'all',
        sentAt: n.sentAt,
        readCount: n.readCount || 0
      }));
      setNotifications(mapped);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "sent" && n.status === "sent") || // Currently backend only has 'sent' effectively
      (activeTab === "scheduled" && n.status === "scheduled") ||
      (activeTab === "drafts" && n.status === "draft");
    return matchesSearch && matchesTab;
  });

  const handleCreateNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await notificationService.createNotification({
        ...newNotification,
        type: newNotification.type,
      });
      toast.success("Notification created successfully");
      setShowCreateDialog(false);
      setNewNotification({
        title: "",
        message: "",
        type: "announcement",
        audience: "all",
        sendNow: true,
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to create notification", error);
      toast.error("Failed to create notification");
    }
  };

  const handleDeleteNotification = async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Manage announcements, alerts, and system notifications
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="rounded-xl gradient-primary shadow-primary">
                <Plus className="mr-2 h-4 w-4" />
                Create Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Notification</DialogTitle>
                <DialogDescription>
                  Send announcements, alerts, or reminders to users
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Notification title"
                    value={newNotification.title}
                    onChange={(e) =>
                      setNewNotification({ ...newNotification, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Write your notification message..."
                    rows={4}
                    value={newNotification.message}
                    onChange={(e) =>
                      setNewNotification({ ...newNotification, message: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={newNotification.type}
                      onValueChange={(value: any) =>
                        setNewNotification({ ...newNotification, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="alert">Alert</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Audience</Label>
                    <Select
                      value={newNotification.audience}
                      onValueChange={(value: any) =>
                        setNewNotification({ ...newNotification, audience: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="students">Students Only</SelectItem>
                        <SelectItem value="faculty">Faculty Only</SelectItem>
                        <SelectItem value="admins">Admins Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="send-now">Send immediately</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle off to save as draft or schedule
                    </p>
                  </div>
                  <Switch
                    id="send-now"
                    checked={newNotification.sendNow}
                    onCheckedChange={(checked) =>
                      setNewNotification({ ...newNotification, sendNow: checked })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNotification}>
                  <Send className="mr-2 h-4 w-4" />
                  {newNotification.sendNow ? "Send Now" : "Save Draft"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sent</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
              <p className="text-xs text-muted-foreground">Total notifications</p>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notifications.filter(n => n.status === 'scheduled').length}
              </div>
              <p className="text-xs text-muted-foreground">Pending delivery</p>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Read Rate</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--%</div>
              <p className="text-xs text-success">Analytics coming soon</p>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notifications.filter(n => n.status === 'draft').length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Content */}
        <Card className="shadow-card rounded-xl">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="font-display text-lg">Notification History</CardTitle>
                <CardDescription>View and manage all notifications</CardDescription>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    className="pl-10 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-12">Loading...</div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">No notifications found</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => {
                      const TypeIcon = typeIcons[notification.type as keyof typeof typeIcons] || Info;
                      const statusColor = statusColors[notification.status as keyof typeof statusColors] || "bg-muted";
                      const typeColor = typeColors[notification.type as keyof typeof typeColors] || "bg-info text-info-foreground";

                      return (
                        <div
                          key={notification.id}
                          className="flex gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/50"
                        >
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${typeColor}`}
                          >
                            <TypeIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-medium">{notification.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                  {notification.message}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={statusColor}>
                                  {notification.status}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteNotification(notification.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {notification.audience === "all"
                                  ? "All Users"
                                  : notification.audience.charAt(0).toUpperCase() +
                                  notification.audience.slice(1)}
                              </span>
                              {notification.sentAt && (
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Sent {format(new Date(notification.sentAt), "MMM d, h:mm a")}
                                </span>
                              )}
                              {notification.readCount !== undefined && (
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {notification.readCount} reads
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
