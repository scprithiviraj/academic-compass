import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/curriculum" element={<CurriculumPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          
          {/* Faculty Routes */}
          <Route path="/faculty" element={<FacultyDashboard />} />
          <Route path="/faculty/attendance" element={<AttendancePage />} />
          <Route path="/faculty/*" element={<FacultyDashboard />} />
          
          {/* Student Routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/attendance" element={<AttendanceCheckIn />} />
          <Route path="/student/activities" element={<ActivitiesPage />} />
          <Route path="/student/schedule" element={<SchedulePage />} />
          <Route path="/student/*" element={<StudentDashboard />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
