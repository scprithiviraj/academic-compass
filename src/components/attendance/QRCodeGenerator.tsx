import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Download, Clock, Users, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClassSession {
  id: string;
  subject: string;
  section: string;
  time: string;
  students: number;
}

interface QRCodeGeneratorProps {
  classes?: ClassSession[];
}

export function QRCodeGenerator({ classes = defaultClasses }: QRCodeGeneratorProps) {
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || "");
  const [qrData, setQrData] = useState<string>("");
  const [expiryTime, setExpiryTime] = useState<number>(300); // 5 minutes default
  const [timeRemaining, setTimeRemaining] = useState<number>(expiryTime);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

  const generateQRCode = () => {
    const timestamp = Date.now();
    const selectedClassData = classes.find((c) => c.id === selectedClass);
    const data = {
      classId: selectedClass,
      subject: selectedClassData?.subject,
      section: selectedClassData?.section,
      timestamp,
      expiresAt: timestamp + expiryTime * 1000,
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
    };
    setQrData(JSON.stringify(data));
    setTimeRemaining(expiryTime);
    setIsActive(true);
    toast({
      title: "QR Code Generated",
      description: `Valid for ${expiryTime / 60} minutes`,
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            toast({
              title: "QR Code Expired",
              description: "Generate a new code for attendance",
              variant: "destructive",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const downloadQR = () => {
    const svg = document.getElementById("attendance-qr");
    if (!svg) return;

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
      downloadLink.download = `attendance-qr-${selectedClass}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const copyCode = () => {
    if (qrData) {
      const data = JSON.parse(qrData);
      navigator.clipboard.writeText(data.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Code Copied",
        description: "Attendance code copied to clipboard",
      });
    }
  };

  const selectedClassData = classes.find((c) => c.id === selectedClass);

  return (
    <Card className="shadow-card rounded-xl">
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          QR Code Generator
        </CardTitle>
        <CardDescription>Generate a unique QR code for attendance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Class Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Select Class</label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.subject} - {cls.section} ({cls.time})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Expiry Time Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">QR Valid Duration</label>
          <Select value={expiryTime.toString()} onValueChange={(v) => setExpiryTime(parseInt(v))}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="60">1 minute</SelectItem>
              <SelectItem value="180">3 minutes</SelectItem>
              <SelectItem value="300">5 minutes</SelectItem>
              <SelectItem value="600">10 minutes</SelectItem>
              <SelectItem value="900">15 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* QR Code Display */}
        <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl">
          {qrData && isActive ? (
            <>
              <div className="p-4 bg-white rounded-xl shadow-lg">
                <QRCodeSVG
                  id="attendance-qr"
                  value={qrData}
                  size={200}
                  level="H"
                  includeMargin
                  bgColor="#ffffff"
                  fgColor="#1e293b"
                />
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2">
                <Clock className={`h-5 w-5 ${timeRemaining < 60 ? "text-destructive animate-pulse" : "text-primary"}`} />
                <span className={`text-2xl font-bold font-mono ${timeRemaining < 60 ? "text-destructive" : "text-primary"}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Manual Code */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Manual Code:</span>
                <Badge variant="secondary" className="text-lg font-mono px-3 py-1">
                  {JSON.parse(qrData).code}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyCode}>
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-48 w-48 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center bg-background/50">
                <span className="text-muted-foreground text-sm text-center px-4">
                  QR Code will appear here
                </span>
              </div>
            </div>
          )}
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
          <Button
            onClick={generateQRCode}
            className="flex-1 rounded-xl gradient-primary shadow-primary"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isActive ? "" : ""}`} />
            {isActive ? "Regenerate" : "Generate QR"}
          </Button>
          {qrData && isActive && (
            <Button variant="outline" className="rounded-xl" onClick={downloadQR}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const defaultClasses: ClassSession[] = [
  { id: "1", subject: "Data Structures", section: "CS-A", time: "09:00 - 10:30", students: 45 },
  { id: "2", subject: "Data Structures", section: "CS-B", time: "11:00 - 12:30", students: 42 },
  { id: "3", subject: "Algorithms", section: "CS-A", time: "02:00 - 03:30", students: 45 },
];
