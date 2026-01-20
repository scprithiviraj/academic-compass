import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, CheckCircle2, XCircle, Keyboard, QrCode, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRScannerProps {
  onScanSuccess?: (data: AttendanceData) => void;
  studentId?: string;
  studentName?: string;
}

interface AttendanceData {
  classId: string;
  subject: string;
  section: string;
  timestamp: number;
  expiresAt: number;
  code: string;
}

type ScanStatus = "idle" | "scanning" | "success" | "error" | "expired";

export function QRScanner({ onScanSuccess, studentId = "CS2021001", studentName = "John Doe" }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [manualCode, setManualCode] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [lastScannedData, setLastScannedData] = useState<AttendanceData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { toast } = useToast();

  const startScanning = async () => {
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onQRCodeSuccess,
        onQRCodeError
      );

      setIsScanning(true);
      setScanStatus("scanning");
    } catch (err) {
      console.error("Error starting scanner:", err);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setIsScanning(false);
    setScanStatus("idle");
  };

  const onQRCodeSuccess = (decodedText: string) => {
    processAttendanceCode(decodedText);
  };

  const onQRCodeError = (error: string) => {
    // Silent fail for scanning errors
  };

  const processAttendanceCode = async (data: string) => {
    setIsProcessing(true);
    
    try {
      const attendanceData: AttendanceData = JSON.parse(data);
      const now = Date.now();

      // Check if QR code has expired
      if (now > attendanceData.expiresAt) {
        setScanStatus("expired");
        toast({
          title: "QR Code Expired",
          description: "This attendance code has expired. Ask your teacher for a new one.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Simulate API call for marking attendance
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setLastScannedData(attendanceData);
      setScanStatus("success");
      stopScanning();

      toast({
        title: "Attendance Marked! ✓",
        description: `Successfully marked for ${attendanceData.subject}`,
      });

      onScanSuccess?.(attendanceData);
    } catch (err) {
      setScanStatus("error");
      toast({
        title: "Invalid QR Code",
        description: "This QR code is not valid for attendance.",
        variant: "destructive",
      });
    }
    
    setIsProcessing(false);
  };

  const handleManualSubmit = () => {
    if (manualCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-character code.",
        variant: "destructive",
      });
      return;
    }

    // Simulate checking manual code - in real app, this would validate against backend
    const mockData: AttendanceData = {
      classId: "1",
      subject: "Data Structures",
      section: "CS-A",
      timestamp: Date.now(),
      expiresAt: Date.now() + 300000,
      code: manualCode.toUpperCase(),
    };

    processAttendanceCode(JSON.stringify(mockData));
    setManualCode("");
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const getStatusDisplay = () => {
    switch (scanStatus) {
      case "success":
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center animate-scale-in">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-success">Attendance Marked!</h3>
              {lastScannedData && (
                <p className="text-muted-foreground mt-1">
                  {lastScannedData.subject} - Section {lastScannedData.section}
                </p>
              )}
            </div>
            <Badge className="bg-success/10 text-success border-success/30">
              {new Date().toLocaleTimeString()}
            </Badge>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-20 w-20 rounded-full bg-destructive/20 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-destructive">Invalid QR Code</h3>
              <p className="text-muted-foreground mt-1">Please try scanning again</p>
            </div>
          </div>
        );
      case "expired":
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-20 w-20 rounded-full bg-warning/20 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-warning" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-warning">Code Expired</h3>
              <p className="text-muted-foreground mt-1">Ask your teacher for a new QR code</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-card rounded-xl">
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          Scan Attendance
        </CardTitle>
        <CardDescription>Scan the QR code displayed by your teacher</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Student Info */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
          <div>
            <p className="font-medium">{studentName}</p>
            <p className="text-sm text-muted-foreground">{studentId}</p>
          </div>
          <Badge variant="outline">Student</Badge>
        </div>

        {/* Scanner Area */}
        {scanStatus !== "success" && scanStatus !== "error" && scanStatus !== "expired" && !showManualInput && (
          <div className="space-y-4">
            <div
              id="qr-reader"
              className={`overflow-hidden rounded-2xl bg-black/5 ${
                isScanning ? "min-h-[300px]" : "min-h-0"
              }`}
            />

            {!isScanning && (
              <div className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl">
                <div className="h-32 w-32 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center bg-background/50">
                  <Camera className="h-12 w-12 text-primary/50" />
                </div>
                <p className="text-center text-muted-foreground">
                  Click the button below to start scanning
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={isScanning ? stopScanning : startScanning}
                className={`flex-1 rounded-xl ${
                  isScanning ? "bg-destructive hover:bg-destructive/90" : "gradient-primary shadow-primary"
                }`}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isScanning ? (
                  <CameraOff className="mr-2 h-4 w-4" />
                ) : (
                  <Camera className="mr-2 h-4 w-4" />
                )}
                {isProcessing ? "Processing..." : isScanning ? "Stop Camera" : "Start Scanning"}
              </Button>
            </div>
          </div>
        )}

        {/* Status Display */}
        {getStatusDisplay()}

        {/* Manual Code Input Toggle */}
        <div className="border-t pt-4">
          <Button
            variant="ghost"
            className="w-full rounded-xl"
            onClick={() => {
              setShowManualInput(!showManualInput);
              if (isScanning) stopScanning();
              setScanStatus("idle");
            }}
          >
            <Keyboard className="mr-2 h-4 w-4" />
            {showManualInput ? "Use QR Scanner" : "Enter Code Manually"}
          </Button>
        </div>

        {/* Manual Code Input */}
        {showManualInput && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter Attendance Code</label>
              <Input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="XXXXXX"
                maxLength={6}
                className="text-center text-2xl font-mono tracking-widest rounded-xl h-14"
              />
            </div>
            <Button
              onClick={handleManualSubmit}
              className="w-full rounded-xl gradient-primary shadow-primary"
              disabled={manualCode.length !== 6 || isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              {isProcessing ? "Submitting..." : "Submit Attendance"}
            </Button>
          </div>
        )}

        {/* Reset Button for Success/Error states */}
        {(scanStatus === "success" || scanStatus === "error" || scanStatus === "expired") && (
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => {
              setScanStatus("idle");
              setShowManualInput(false);
            }}
          >
            Scan Another Code
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
