import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CurriculumPage from "./pages/admin/CurriculumPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import AttendancePage from "./pages/faculty/AttendancePage";
import AttendanceCheckIn from "./pages/student/AttendanceCheckIn";
import ActivitiesPage from "./pages/student/ActivitiesPage";
import SchedulePage from "./pages/student/SchedulePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/curriculum" element={<ProtectedRoute allowedRoles={['ADMIN']}><CurriculumPage /></ProtectedRoute>} />
            <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />

            {/* Faculty Routes */}
            <Route path="/faculty" element={<ProtectedRoute allowedRoles={['TEACHER']}><FacultyDashboard /></ProtectedRoute>} />
            <Route path="/faculty/attendance" element={<ProtectedRoute allowedRoles={['TEACHER']}><AttendancePage /></ProtectedRoute>} />
            <Route path="/faculty/*" element={<ProtectedRoute allowedRoles={['TEACHER']}><FacultyDashboard /></ProtectedRoute>} />

            {/* Student Routes */}
            <Route path="/student" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/attendance" element={<ProtectedRoute allowedRoles={['STUDENT']}><AttendanceCheckIn /></ProtectedRoute>} />
            <Route path="/student/activities" element={<ProtectedRoute allowedRoles={['STUDENT']}><ActivitiesPage /></ProtectedRoute>} />
            <Route path="/student/schedule" element={<ProtectedRoute allowedRoles={['STUDENT']}><SchedulePage /></ProtectedRoute>} />
            <Route path="/student/*" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
