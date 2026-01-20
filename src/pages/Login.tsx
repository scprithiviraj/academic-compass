import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type UserRole = "admin" | "faculty" | "student";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [isLoading, setIsLoading] = useState(false);

  const roles: { id: UserRole; label: string; description: string }[] = [
    { id: "student", label: "Student", description: "Track your attendance & activities" },
    { id: "faculty", label: "Faculty", description: "Manage classes & mark attendance" },
    { id: "admin", label: "Admin", description: "Full system administration" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Navigate based on role
    navigate(`/${selectedRole}`);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-20">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-primary">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <span className="font-display font-bold text-3xl text-white">EduTrack</span>
            </div>
            
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Smart Curriculum &<br />
              <span className="text-gradient-primary bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Attendance System
              </span>
            </h1>
            
            <p className="text-lg text-white/70 max-w-md leading-relaxed">
              Automate attendance tracking, personalize learning activities, and gain actionable insights for student success.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-6">
              {[
                { value: "98%", label: "Attendance Accuracy" },
                { value: "2.5x", label: "Productivity Boost" },
                { value: "500+", label: "Institutions" },
                { value: "50K+", label: "Active Students" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={cn("animate-fade-in", `stagger-${i + 1}`)}
                  style={{ opacity: 0 }}
                >
                  <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-info/10 blur-3xl" />
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md animate-scale-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl">EduTrack</span>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="font-display text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Select your role</Label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={cn(
                    "relative rounded-xl p-4 text-left transition-all duration-200 border-2",
                    selectedRole === role.id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <p className="font-medium text-sm">{role.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-tight">
                    {role.description}
                  </p>
                  {selectedRole === role.id && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                      <svg
                        className="h-2.5 w-2.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl font-medium text-base gradient-primary shadow-primary hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign in
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button className="text-primary hover:underline font-medium">
              Contact your administrator
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
