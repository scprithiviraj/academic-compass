import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Download, Users, Copy, CheckCircle2, Loader2, Key, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TodayClass, facultyService } from "@/services/faculty.service";

interface QRCodeGeneratorProps {
  classes: TodayClass[];
  isLoading?: boolean;
}

export function QRCodeGenerator({ classes, isLoading = false }: QRCodeGeneratorProps) {
  // Use a composite key (id + time) to uniquely identify class instances
  // This handles cases where the same course (same ID) is scheduled multiple times in a day
  const getUniqueKey = (cls: TodayClass) => `${cls.id}-${cls.time}`;

  const [selectedKey, setSelectedKey] = useState<string>("");
  const [qrData, setQrData] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedQR, setCopiedQR] = useState<boolean>(false);
  const [copiedOTP, setCopiedOTP] = useState<boolean>(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (classes.length > 0 && !selectedKey) {
      setSelectedKey(getUniqueKey(classes[0]));
    }
  }, [classes, selectedKey]);

  // Timer logic
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const distance = expiry - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("00:00");
        setIsExpired(true);
        setIsActive(false); // Disable active state
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        setIsExpired(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  // Find the selected class object based on the unique key
  const selectedClassData = classes.find((c) => getUniqueKey(c) === selectedKey);
  const isClassCompleted = selectedClassData?.status === "completed";

  const generateQRCode = async () => {
    if (!selectedClassData) return;

    try {
      setIsGenerating(true);

      const [startTime, endTime] = selectedClassData.time.split(" - ");

      const response = await facultyService.generateQRCode(
        selectedClassData.id,
        startTime,
        endTime
      );

      setQrData(response.qrToken);
      setOtpCode(response.otpCode);
      setSessionId(response.sessionId);
      // Ensure backend provides this, or default/handle missing
      setExpiresAt(response.expiresAt || null);
      setIsActive(true);
      setIsExpired(false);

      toast({
        title: "QR Code Generated",
        description: "Students can now scan the QR or use the OTP code",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to generate QR code",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const endSession = async () => {
    if (!sessionId) return;
    try {
      setIsGenerating(true);
      await facultyService.endSession(sessionId);

      setIsActive(false);
      setIsExpired(true);
      setExpiresAt(null); // Stop timer
      setTimeLeft("00:00");

      toast({
        title: "Session Ended",
        description: "Attendance session has been closed. Absentees have been marked.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to end session",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById("attendance-qr");
    if (!svg || !selectedClassData) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `attendance-qr-${selectedClassData.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const copyCode = (code: string, type: 'QR' | 'OTP') => {
    navigator.clipboard.writeText(code);
    if (type === 'QR') {
      setCopiedQR(true);
      setTimeout(() => setCopiedQR(false), 2000);
    } else {
      setCopiedOTP(true);
      setTimeout(() => setCopiedOTP(false), 2000);
    }
    toast({
      title: "Code Copied",
      description: `${type} code copied to clipboard`,
    });
  };

  return (
    <Card className="shadow-card rounded-xl">
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            QR Code & OTP
          </div>
          {isActive && !isExpired && (
            <Badge variant="outline" className="font-mono text-base px-3 py-1 flex items-center gap-2 bg-primary/5 border-primary/20">
              <Timer className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-primary font-bold">{timeLeft}</span>
            </Badge>
          )}
          {isExpired && qrData && (
            <Badge variant="destructive" className="font-mono text-base px-3 py-1 flex items-center gap-2">
              Session Expired
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Generate unified attendance session</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No classes scheduled for today</p>
          </div>
        ) : (
          <>
            {/* Class Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Class</label>
              <Select value={selectedKey} onValueChange={setSelectedKey}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={getUniqueKey(cls)} value={getUniqueKey(cls)}>
                      {cls.subject} - {cls.section} ({cls.time})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Warning for Non-Ongoing Classes */}
            {selectedClassData && selectedClassData.status !== "ongoing" && (
              <div className={`p-4 rounded-xl border ${selectedClassData.status === "completed"
                ? "bg-warning/10 border-warning/30 text-warning"
                : "bg-blue-500/10 border-blue-500/30 text-blue-500"
                }`}>
                <p className="text-sm font-medium flex items-center gap-2">
                  {selectedClassData.status === "completed" ? (
                    <>⚠️ This class has been completed.</>
                  ) : (
                    <>ℹ️ This class has not started yet.</>
                  )}
                  QR code and OTP generation are disabled.
                </p>
              </div>
            )}

            {/* QR Code and OTP Display */}
            <div className="relative">
              {/* Overlay for Expired State */}
              {isExpired && qrData && (
                <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-2xl border-2 border-destructive/20">
                  <div className="p-6 bg-background rounded-xl shadow-lg border border-border text-center">
                    <p className="text-lg font-semibold text-destructive mb-2">Session Expired</p>
                    <p className="text-sm text-muted-foreground mb-4">Please regenerate to start a new session.</p>
                    <Button onClick={generateQRCode} disabled={isGenerating}>
                      {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                      Regenerate Session
                    </Button>
                  </div>
                </div>
              )}

              {/* QR Code & OTP Combined */}
              <div className={`flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/10 ${isExpired ? 'opacity-50' : ''}`}>
                {qrData && (isActive || isExpired) ? (
                  <>
                    <div className="p-4 bg-white rounded-xl shadow-lg">
                      <QRCodeSVG
                        id="attendance-qr"
                        value={qrData}
                        size={240}
                        level="H"
                        includeMargin
                        bgColor="#ffffff"
                        fgColor="#1e293b"
                      />
                    </div>

                    {otpCode && (
                      <div className="flex flex-col items-center justify-center text-center">
                        <p className="text-sm font-medium text-muted-foreground mb-1">OTP Code</p>
                        <div
                          className="text-7xl font-bold font-mono text-primary tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => copyCode(otpCode, 'OTP')}
                          title="Click to copy OTP"
                        >
                          {otpCode}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => copyCode(otpCode, 'OTP')} disabled={isExpired} className="mt-1 h-6 text-xs text-muted-foreground">
                          {copiedOTP ? "Copied!" : "Click to copy"}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-12">
                    <div className="h-48 w-48 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center bg-background/50">
                      <span className="text-muted-foreground text-sm text-center px-4">
                        QR Code will appear here
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Class Info */}
            {selectedClassData && (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedClassData.students} students enrolled</span>
                </div>
                <Badge variant="outline">{selectedClassData.section}</Badge>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {isActive && !isExpired ? (
                <Button
                  onClick={endSession}
                  disabled={isGenerating}
                  className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90"
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Stop Session And Mark Absentees
                </Button>
              ) : (
                <Button
                  onClick={generateQRCode}
                  disabled={isGenerating || !selectedClassData || selectedClassData.status !== "ongoing"}
                  className="flex-1 rounded-xl"
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  {isGenerating ? "Generating..." : "Generate QR & OTP"}
                </Button>
              )}

              {qrData && isActive && !isExpired && (
                <Button variant="outline" className="rounded-xl" onClick={downloadQR}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
