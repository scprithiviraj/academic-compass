import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Settings,
  Bell,
  Palette,
  Clock,
  Globe,
  Save,
  Upload,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import settingsService from "@/services/SettingsService";
import { useTheme } from "@/contexts/ThemeContext";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // General settings
  const [institutionName, setInstitutionName] = useState("");
  const [timezone, setTimezone] = useState("America/New_York");
  const [language, setLanguage] = useState("en");

  // Attendance settings
  const [autoMarkAbsent, setAutoMarkAbsent] = useState(true);
  const [lateThreshold, setLateThreshold] = useState("15");
  const [qrExpiry, setQrExpiry] = useState("5");

  // Notification settings
  const [lowAttendanceAlert, setLowAttendanceAlert] = useState(true);
  const [attendanceThreshold, setAttendanceThreshold] = useState("75");

  // Appearance settings via Context
  const { colorTheme, displayMode, setColorTheme, setDisplayMode } = useTheme();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();

      // General
      setInstitutionName(data.institutionName || "EduTrack University");
      setTimezone(data.timezone || "America/New_York");
      setLanguage(data.language || "en");

      // Attendance
      setAutoMarkAbsent(data.autoMarkAbsent === "true");
      setLateThreshold(data.lateThreshold || "15");
      setQrExpiry(data.qrExpiry || "5");

      // Notification
      setLowAttendanceAlert(data.lowAttendanceAlert === "true");
      setAttendanceThreshold(data.attendanceThreshold || "75");

      // Appearance - Sync context if backend data exists
      if (data.colorTheme) setColorTheme(data.colorTheme as any);
      if (data.displayMode) setDisplayMode(data.displayMode as any);

    } catch (error) {
      console.error("Failed to load settings:", error);
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const settingsPayload = {
        // General
        institutionName,
        timezone,
        language,

        // Attendance
        autoMarkAbsent: String(autoMarkAbsent),
        lateThreshold,
        qrExpiry,

        // Notification
        lowAttendanceAlert: String(lowAttendanceAlert),
        attendanceThreshold,

        // Appearance
        colorTheme,
        displayMode,
      };

      await settingsService.updateSettings(settingsPayload);
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    // In a real app, this might call a 'reset' endpoint or just re-fetch defaults
    toast.info("Refetching latest settings...");
    await fetchSettings();
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

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
            <Button variant="outline" className="rounded-xl" onClick={handleReset} disabled={saving}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload
            </Button>
            <Button className="rounded-xl gradient-primary shadow-primary" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 lg:w-auto rounded-xl">
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
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
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
                    <div
                      className={`flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors ${colorTheme === 'default' ? 'border-primary' : ''}`}
                      onClick={() => setColorTheme('default')}
                    >
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-blue-600" />
                      <span className="text-sm font-medium">Default</span>
                    </div>
                    <div
                      className={`flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors ${colorTheme === 'forest' ? 'border-primary' : ''}`}
                      onClick={() => setColorTheme('forest')}
                    >
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600" />
                      <span className="text-sm font-medium">Forest</span>
                    </div>
                    <div
                      className={`flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors ${colorTheme === 'purple' ? 'border-primary' : ''}`}
                      onClick={() => setColorTheme('purple')}
                    >
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-600" />
                      <span className="text-sm font-medium">Purple</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Display Mode</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors ${displayMode === 'light' ? 'border-primary' : ''}`}
                      onClick={() => setDisplayMode('light')}
                    >
                      <div className="h-8 w-8 rounded bg-background border" />
                      <span className="font-medium">Light</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors ${displayMode === 'dark' ? 'border-primary' : ''}`}
                      onClick={() => setDisplayMode('dark')}
                    >
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
