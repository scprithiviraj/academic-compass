import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Download, Users, Copy, CheckCircle2, Loader2, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TodayClass, facultyService } from "@/services/faculty.service";

interface QRCodeGeneratorProps {
  classes: TodayClass[];
  isLoading?: boolean;
}

export function QRCodeGenerator({ classes, isLoading = false }: QRCodeGeneratorProps) {
  const [selectedClass, setSelectedClass] = useState<number>(classes[0]?.id || 0);
  const [qrData, setQrData] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedQR, setCopiedQR] = useState<boolean>(false);
  const [copiedOTP, setCopiedOTP] = useState<boolean>(false);
  const { toast } = useToast();

  const generateQRCode = async () => {
    if (!selectedClass) return;

    try {
      setIsGenerating(true);
      const response = await facultyService.generateQRCode(selectedClass);

      setQrData(response.qrToken);
      setOtpCode(response.otpCode);
      setIsActive(true);

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

  const selectedClassData = classes.find((c) => c.id === selectedClass);

  return (
    <Card className="shadow-card rounded-xl">
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          QR Code Generator
        </CardTitle>
        <CardDescription>Generate QR code and OTP for attendance</CardDescription>
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
              <Select value={selectedClass.toString()} onValueChange={(v) => setSelectedClass(parseInt(v))}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.subject} - {cls.section} ({cls.time})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* QR Code and OTP Display */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* QR Code */}
              <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl">
                {qrData && isActive ? (
                  <>
                    <div className="p-4 bg-white rounded-xl shadow-lg">
                      <QRCodeSVG
                        id="attendance-qr"
                        value={qrData}
                        size={180}
                        level="H"
                        includeMargin
                        bgColor="#ffffff"
                        fgColor="#1e293b"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">QR Token:</span>
                      <Badge variant="secondary" className="text-xs font-mono px-2 py-1">
                        {qrData.substring(0, 8)}...
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyCode(qrData, 'QR')}>
                        {copiedQR ? (
                          <CheckCircle2 className="h-3 w-3 text-success" />
                        ) : (
                          <Copy className="h-3 w-3" />
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

              {/* OTP Code */}
              <div className="flex flex-col items-center justify-center gap-4 p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-2xl">
                {otpCode && isActive ? (
                  <>
                    <Key className="h-12 w-12 text-secondary" />
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">OTP Code</p>
                      <div className="text-4xl font-bold font-mono tracking-wider text-secondary">
                        {otpCode}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => copyCode(otpCode, 'OTP')}>
                      {copiedOTP ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2 text-success" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy OTP
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <span className="text-muted-foreground text-sm">
                      OTP will appear here
                    </span>
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
              <Button
                onClick={generateQRCode}
                disabled={isGenerating || !selectedClass}
                className="flex-1 rounded-xl gradient-primary shadow-primary"
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                {isGenerating ? "Generating..." : isActive ? "Regenerate" : "Generate QR & OTP"}
              </Button>
              {qrData && isActive && (
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
