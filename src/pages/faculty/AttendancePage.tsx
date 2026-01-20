import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { QRCodeGenerator } from "@/components/attendance/QRCodeGenerator";
import { AttendanceList } from "@/components/attendance/AttendanceList";
import { TimeBasedAttendance } from "@/components/attendance/TimeBasedAttendance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Clock, ClipboardList, Scan } from "lucide-react";

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState("qr-code");

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Attendance Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate QR codes, track time-based attendance, and view reports
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid rounded-xl h-12 p-1 bg-muted/50">
            <TabsTrigger value="qr-code" className="rounded-lg gap-2 data-[state=active]:shadow-sm">
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">QR Code</span>
            </TabsTrigger>
            <TabsTrigger value="time-based" className="rounded-lg gap-2 data-[state=active]:shadow-sm">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Time-Based</span>
            </TabsTrigger>
            <TabsTrigger value="attendance-list" className="rounded-lg gap-2 data-[state=active]:shadow-sm">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">View List</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr-code" className="space-y-6 animate-fade-in">
            <div className="grid gap-6 lg:grid-cols-2">
              <QRCodeGenerator />
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <h3 className="font-semibold flex items-center gap-2 mb-4">
                    <Scan className="h-5 w-5 text-primary" />
                    How it works
                  </h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        1
                      </span>
                      <span>Select a class and set the QR code validity duration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        2
                      </span>
                      <span>Generate and display the QR code to your students</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        3
                      </span>
                      <span>Students scan the code using their mobile devices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        4
                      </span>
                      <span>Attendance is automatically recorded in real-time</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 rounded-xl bg-muted/50 border">
                  <h3 className="font-semibold mb-3">Tips for best results</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Display the QR code on a large screen for better scanning</li>
                    <li>• Use shorter validity times to prevent sharing</li>
                    <li>• Enable WiFi validation for location-based attendance</li>
                    <li>• Regenerate code periodically for security</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="time-based" className="animate-fade-in">
            <TimeBasedAttendance />
          </TabsContent>

          <TabsContent value="attendance-list" className="animate-fade-in">
            <AttendanceList />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
