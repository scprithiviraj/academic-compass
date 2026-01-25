import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  ClipboardCheck,
  Target,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "admin" | "faculty" | "student";
}

const navigationItems = {
  admin: [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Curriculum", href: "/admin/curriculum", icon: BookOpen },
    { name: "Attendance", href: "/admin/attendance", icon: ClipboardCheck },
    { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ],
  faculty: [
    { name: "Dashboard", href: "/faculty", icon: LayoutDashboard },
    { name: "My Classes", href: "/faculty/classes", icon: Calendar },
    { name: "Attendance", href: "/faculty/attendance", icon: ClipboardCheck },
    { name: "Students", href: "/faculty/students", icon: Users },
    { name: "Analytics", href: "/faculty/analytics", icon: BarChart3 },
    { name: "Notifications", href: "/faculty/notifications", icon: Bell },
  ],
  student: [
    { name: "Dashboard", href: "/student", icon: LayoutDashboard },
    { name: "My Schedule", href: "/student/schedule", icon: Calendar },
    { name: "Activities", href: "/student/activities", icon: Target },
    { name: "Attendance", href: "/student/attendance", icon: ClipboardCheck },
    { name: "Progress", href: "/student/progress", icon: BarChart3 },
    { name: "Notifications", href: "/student/notifications", icon: Bell },
  ],
};

const roleLabels = {
  admin: "Administrator",
  faculty: "Faculty",
  student: "Student",
};

const roleColors = {
  admin: "bg-primary",
  faculty: "bg-secondary",
  student: "bg-info",
};

import { useAuth } from "@/hooks/useAuth";

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const navItems = navigationItems[role];

  // Get user initials
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform bg-sidebar transition-transform duration-300 ease-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-sidebar-foreground">
                  EduTrack
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "ml-2 text-[10px] px-1.5 py-0 border-0 text-white",
                    roleColors[role]
                  )}
                >
                  {roleLabels[role]}
                </Badge>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-sidebar-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-6">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        isActive ? "" : "group-hover:scale-110"
                      )}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <ChevronRight className="ml-auto h-4 w-4 animate-fade-in" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User section */}
          <div className="border-t border-sidebar-border p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-sidebar-accent">
                  <Avatar className="h-10 w-10 border-2 border-sidebar-border">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground font-medium">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">
                      {user?.email || "email@example.com"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          {/* Quick actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                3
              </span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
