import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  Plus,
  Search,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Send,
  Users,
  Filter,
  Trash2,
  Eye,
} from "lucide-react";
import { format } from "date-fns";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "alert" | "info" | "success" | "warning";
  recipient: string;
  sentAt: Date;
  read: boolean;
  category: "attendance" | "announcement" | "reminder" | "system";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Low Attendance Alert",
    message: "David Lee's attendance has dropped below 50%. Immediate action required.",
    type: "alert",
    recipient: "Self",
    sentAt: new Date(2024, 0, 15, 9, 30),
    read: false,
    category: "attendance",
  },
  {
    id: "2",
    title: "Class Reminder Sent",
    message: "Reminder sent to CS301 students about tomorrow's quiz.",
    type: "success",
    recipient: "CS301 Students",
    sentAt: new Date(2024, 0, 14, 14, 0),
    read: true,
    category: "reminder",
  },
  {
    id: "3",
    title: "New Assignment Submitted",
    message: "15 students have submitted the Data Structures assignment.",
    type: "info",
    recipient: "Self",
    sentAt: new Date(2024, 0, 14, 11, 45),
    read: true,
    category: "announcement",
  },
  {
    id: "4",
    title: "Attendance Warning",
    message: "3 students in CS201 have attendance below 75%.",
    type: "warning",
    recipient: "Self",
    sentAt: new Date(2024, 0, 13, 16, 20),
    read: false,
    category: "attendance",
  },
  {
    id: "5",
    title: "System Maintenance",
    message: "Scheduled maintenance on Saturday from 2 AM to 6 AM.",
    type: "info",
    recipient: "All Faculty",
    sentAt: new Date(2024, 0, 12, 10, 0),
    read: true,
    category: "system",
  },
];

const mockClasses = [
  { id: "1", name: "CS101 - Introduction to Programming" },
  { id: "2", name: "CS201 - Data Structures" },
  { id: "3", name: "CS301 - Algorithms" },
  { id: "4", name: "CS401 - Database Systems" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info" as Notification["type"],
    recipients: [] as string[],
  });

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
      default:
        return <Info className="h-5 w-5 text-info" />;
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
      default:
        return <Badge className="bg-info/10 text-info border-info/20">Info</Badge>;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSendNotification = () => {
    const notification: Notification = {
      id: Date.now().toString(),
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      recipient: newNotification.recipients.join(", ") || "Selected Students",
      sentAt: new Date(),
      read: true,
      category: "announcement",
    };
    setNotifications((prev) => [notification, ...prev]);
    setNewNotification({ title: "", message: "", type: "info", recipients: [] });
    setIsComposeOpen(false);
  };

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Manage alerts, announcements, and student reminders
            </p>
          </div>
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Send Notification</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Notification title..."
                    value={newNotification.title}
                    onChange={(e) =>
                      setNewNotification((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Write your message..."
                    rows={4}
                    value={newNotification.message}
                    onChange={(e) =>
                      setNewNotification((prev) => ({ ...prev, message: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={newNotification.type}
                    onValueChange={(value: Notification["type"]) =>
                      setNewNotification((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Information</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipients</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {mockClasses.map((cls) => (
                      <div key={cls.id} className="flex items-center gap-2">
                        <Checkbox
                          id={cls.id}
                          checked={newNotification.recipients.includes(cls.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewNotification((prev) => ({
                                ...prev,
                                recipients: [...prev.recipients, cls.name],
                              }));
                            } else {
                              setNewNotification((prev) => ({
                                ...prev,
                                recipients: prev.recipients.filter((r) => r !== cls.name),
                              }));
                            }
                          }}
                        />
                        <label htmlFor={cls.id} className="text-sm cursor-pointer">
                          {cls.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendNotification} className="gap-2">
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attendance Alerts</p>
                <p className="text-2xl font-bold">
                  {notifications.filter((n) => n.category === "attendance").length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Send className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sent Today</p>
                <p className="text-2xl font-bold">
                  {notifications.filter((n) => n.recipient !== "Self").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

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
              <SelectItem value="announcement">Announcements</SelectItem>
              <SelectItem value="reminder">Reminders</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl border transition-colors ${
                      notification.read
                        ? "bg-background border-border"
                        : "bg-primary/5 border-primary/20"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5">{getTypeIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium">{notification.title}</h4>
                          {getTypeBadge(notification.type)}
                          {!notification.read && (
                            <Badge variant="outline" className="text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {notification.recipient}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(notification.sentAt, "MMM d, h:mm a")}
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
                            <Eye className="h-4 w-4" />
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
      </div>
    </DashboardLayout>
  );
}
