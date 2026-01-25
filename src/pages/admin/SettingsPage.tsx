import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Database,
  Clock,
  Globe,
  Mail,
  Smartphone,
  Save,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  
  // General settings
  const [institutionName, setInstitutionName] = useState("EduTrack University");
  const [timezone, setTimezone] = useState("America/New_York");
  const [language, setLanguage] = useState("en");
  
  // Attendance settings
  const [autoMarkAbsent, setAutoMarkAbsent] = useState(true);
  const [lateThreshold, setLateThreshold] = useState("15");
  const [qrExpiry, setQrExpiry] = useState("5");
  const [geofenceEnabled, setGeofenceEnabled] = useState(false);
  const [wifiValidation, setWifiValidation] = useState(false);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [lowAttendanceAlert, setLowAttendanceAlert] = useState(true);
  const [attendanceThreshold, setAttendanceThreshold] = useState("75");
  
  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [passwordExpiry, setPasswordExpiry] = useState("90");

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const handleReset = () => {
    toast.info("Settings reset to defaults");
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage system configuration and preferences
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl" onClick={handleReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
            <Button className="rounded-xl gradient-primary shadow-primary" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 lg:w-auto rounded-xl">
            <TabsTrigger value="general" className="rounded-lg">
              <Settings className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="attendance" className="rounded-lg">
              <Clock className="mr-2 h-4 w-4" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-lg">
              <Palette className="mr-2 h-4 w-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6 mt-6">
            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <CardTitle className="font-display text-lg">Institution Details</CardTitle>
                <CardDescription>Basic information about your institution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-2xl">EU</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Recommended: 200x200px, PNG or JPG
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="institution-name">Institution Name</Label>
                    <Input
                      id="institution-name"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger id="timezone">
                        <Globe className="mr-2 h-4 w-4" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                        <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Default Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <CardTitle className="font-display text-lg">Academic Calendar</CardTitle>
                <CardDescription>Configure academic year settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Current Semester</Label>
                    <Select defaultValue="spring-2025">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spring-2025">Spring 2025</SelectItem>
                        <SelectItem value="fall-2024">Fall 2024</SelectItem>
                        <SelectItem value="summer-2024">Summer 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Working Days</Label>
                    <Select defaultValue="mon-fri">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mon-fri">Monday - Friday</SelectItem>
                        <SelectItem value="mon-sat">Monday - Saturday</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6 mt-6">
            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <CardTitle className="font-display text-lg">Attendance Rules</CardTitle>
                <CardDescription>Configure attendance marking policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Auto-mark absent after class</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically mark students absent if not checked in
                    </p>
                  </div>
                  <Switch checked={autoMarkAbsent} onCheckedChange={setAutoMarkAbsent} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="late-threshold">Late Threshold (minutes)</Label>
                    <Input
                      id="late-threshold"
                      type="number"
                      value={lateThreshold}
                      onChange={(e) => setLateThreshold(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Students marked late after this many minutes
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qr-expiry">QR Code Expiry (minutes)</Label>
                    <Input
                      id="qr-expiry"
                      type="number"
                      value={qrExpiry}
                      onChange={(e) => setQrExpiry(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      QR codes expire after this duration
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <CardTitle className="font-display text-lg">Verification Methods</CardTitle>
                <CardDescription>Additional attendance verification options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Geofence Validation</Label>
                    <p className="text-sm text-muted-foreground">
                      Require students to be within campus boundaries
                    </p>
                  </div>
                  <Switch checked={geofenceEnabled} onCheckedChange={setGeofenceEnabled} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>WiFi Validation</Label>
                    <p className="text-sm text-muted-foreground">
                      Require connection to campus WiFi network
                    </p>
                  </div>
                  <Switch checked={wifiValidation} onCheckedChange={setWifiValidation} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <CardTitle className="font-display text-lg">Notification Channels</CardTitle>
                <CardDescription>Configure how notifications are delivered</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send notifications via email
                      </p>
                    </div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send push notifications to mobile devices
                      </p>
                    </div>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <CardTitle className="font-display text-lg">Alert Settings</CardTitle>
                <CardDescription>Configure automated alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Low Attendance Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when student attendance falls below threshold
                    </p>
                  </div>
                  <Switch checked={lowAttendanceAlert} onCheckedChange={setLowAttendanceAlert} />
                </div>
                {lowAttendanceAlert && (
                  <div className="space-y-2 pl-4 border-l-2 border-primary">
                    <Label htmlFor="attendance-threshold">Alert Threshold (%)</Label>
                    <Input
                      id="attendance-threshold"
                      type="number"
                      value={attendanceThreshold}
                      onChange={(e) => setAttendanceThreshold(e.target.value)}
                      className="w-32"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <CardTitle className="font-display text-lg">Authentication</CardTitle>
                <CardDescription>Configure security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Label>Two-Factor Authentication</Label>
                      <Badge variant="outline" className="text-xs">Recommended</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all admin accounts
                    </p>
                  </div>
                  <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                    <Input
                      id="password-expiry"
                      type="number"
                      value={passwordExpiry}
                      onChange={(e) => setPasswordExpiry(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <CardTitle className="font-display text-lg">System Status</CardTitle>
                <CardDescription>Current security status overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium">SSL Certificate</p>
                    <p className="text-sm text-muted-foreground">Valid until Dec 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium">Database Backup</p>
                    <p className="text-sm text-muted-foreground">Last backup: 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <div>
                    <p className="font-medium">2FA Adoption</p>
                    <p className="text-sm text-muted-foreground">45% of admins have 2FA enabled</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6 mt-6">
            <Card className="shadow-card rounded-xl">
              <CardHeader>
                <CardTitle className="font-display text-lg">Theme Settings</CardTitle>
                <CardDescription>Customize the look and feel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Color Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors border-primary">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-blue-600" />
                      <span className="text-sm font-medium">Default</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600" />
                      <span className="text-sm font-medium">Forest</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-600" />
                      <span className="text-sm font-medium">Purple</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Display Mode</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors border-primary">
                      <div className="h-8 w-8 rounded bg-background border" />
                      <span className="font-medium">Light</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors">
                      <div className="h-8 w-8 rounded bg-slate-900" />
                      <span className="font-medium">Dark</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
