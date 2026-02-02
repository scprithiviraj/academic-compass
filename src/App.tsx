import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CurriculumPage from "./pages/admin/CurriculumPage";
import AdminAttendancePage from "./pages/admin/AttendancePage";
import UsersPage from "./pages/admin/UsersPage";
import ReportsPage from "./pages/admin/ReportsPage";
import NotificationsPage from "./pages/admin/NotificationsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import AdminMentorsPage from "./pages/admin/AdminMentorsPage";
import ActivityManagementPage from "./pages/admin/ActivityManagementPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import ClassesPage from "./pages/faculty/ClassesPage";
import AttendancePage from "./pages/faculty/AttendancePage";
import FacultyStudentsPage from "./pages/faculty/FacultyStudentsPage";
import FacultyAnalyticsPage from "./pages/faculty/FacultyAnalyticsPage";
import FacultyNotificationsPage from "./pages/faculty/NotificationsPage";
import AttendanceCheckIn from "./pages/student/AttendanceCheckIn";
import ActivitiesPage from "./pages/student/ActivitiesPage";
import SchedulePage from "./pages/student/SchedulePage";
import StudentNotificationsPage from "./pages/student/NotificationsPage";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/curriculum" element={<CurriculumPage />} />
              <Route path="/admin/attendance" element={<AdminAttendancePage />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
              <Route path="/admin/notifications" element={<NotificationsPage />} />
              <Route path="/admin/activities" element={<ActivityManagementPage />} />
              <Route path="/admin/mentors" element={<AdminMentorsPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              <Route path="/admin/*" element={<AdminDashboard />} />

              {/* Faculty Routes */}
              <Route path="/faculty" element={<FacultyDashboard />} />
              <Route path="/faculty/classes" element={<ClassesPage />} />
              <Route path="/faculty/attendance" element={<AttendancePage />} />
              <Route path="/faculty/students" element={<FacultyStudentsPage />} />
              <Route path="/faculty/analytics" element={<FacultyAnalyticsPage />} />
              <Route path="/faculty/notifications" element={<FacultyNotificationsPage />} />
              <Route path="/faculty/*" element={<FacultyDashboard />} />

              {/* Student Routes */}
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/attendance" element={<AttendanceCheckIn />} />
              <Route path="/student/activities" element={<ActivitiesPage />} />
              <Route path="/student/schedule" element={<SchedulePage />} />
              <Route path="/student/notifications" element={<StudentNotificationsPage />} />
              <Route path="/student/*" element={<StudentDashboard />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
