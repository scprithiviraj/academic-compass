import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    FileText,
    Download,
    Calendar as CalendarIcon,
    FileSpreadsheet,
    Users,
    BookOpen,
    Building2,
    ClipboardList,
    Filter,
    Loader2
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import adminService from "@/services/admin.service";

export default function ReportsPage() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("attendance");
    const [loading, setLoading] = useState(false);

    // Date range state
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    // Data states
    const [departments, setDepartments] = useState<any[]>([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await adminService.getAllDepartments();
                setDepartments(data);
            } catch (error) {
                console.error("Failed to fetch departments", error);
                toast({
                    title: "Error",
                    description: "Failed to load departments. Using default list.",
                    variant: "destructive",
                });
            }
        };
        fetchDepartments();
    }, []);

    // Filter states
    const [selectedDepartment, setSelectedDepartment] = useState("all");
    const [selectedSemester, setSelectedSemester] = useState("all");
    const [reportFormat, setReportFormat] = useState("excel");

    const handleExport = async (reportType: string, format: string) => {
        setLoading(true);
        try {
            toast({
                title: "Export Started",
                description: `Generating ${reportType} report in ${format.toUpperCase()} format...`,
            });

            console.log("Export Filters:", {
                type: reportType,
                dept: selectedDepartment,
                semester: selectedSemester,
                start: startDate,
                end: endDate
            });

            let data: Blob;
            let filename = `${reportType.toLowerCase()}_report_${new Date().toISOString().split('T')[0]}`;

            if (reportType === "Attendance") {
                if (format === "csv") {
                    data = await adminService.exportAttendanceToCSV(startDate, endDate);
                    filename += ".csv";
                } else if (format === "excel") {
                    data = await adminService.exportAttendanceToExcel(startDate, endDate);
                    filename += ".xlsx";
                } else {
                    throw new Error("Format not supported via API");
                }
            } else if (reportType === "Student") {
                if (format === "csv") {
                    data = await adminService.exportStudentsToCSV(selectedDepartment, selectedSemester);
                    filename += ".csv";
                } else if (format === "excel") {
                    data = await adminService.exportStudentsToExcel(selectedDepartment, selectedSemester);
                    filename += ".xlsx";
                } else {
                    throw new Error("Format not supported via API");
                }
            } else if (reportType === "Course") {
                if (format === "csv") {
                    data = await adminService.exportCoursesToCSV(selectedDepartment, selectedSemester);
                    filename += ".csv";
                } else if (format === "excel") {
                    data = await adminService.exportCoursesToExcel(selectedDepartment, selectedSemester);
                    filename += ".xlsx";
                } else {
                    throw new Error("Format not supported via API");
                }
            } else if (reportType === "Department") {
                if (format === "csv") {
                    data = await adminService.exportDepartmentsToCSV();
                    filename += ".csv";
                } else if (format === "excel") {
                    data = await adminService.exportDepartmentsToExcel();
                    filename += ".xlsx";
                } else {
                    throw new Error("Format not supported via API");
                }
            } else {
                toast({
                    title: "Not Implemented",
                    description: `Export for ${reportType} is not yet available.`,
                    variant: "destructive"
                });
                setLoading(false);
                return;
            }

            // Create download link
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);

            toast({
                title: "Export Complete",
                description: `${reportType} report downloaded successfully!`,
            });
        } catch (error) {
            console.error("Export failed", error);
            toast({
                title: "Export Failed",
                description: "Failed to generate report. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const reportTypes = [
        {
            id: "attendance",
            title: "Attendance Reports",
            description: "Export attendance records with filters",
            icon: ClipboardList,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            id: "students",
            title: "Student Reports",
            description: "Export student data and performance",
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            id: "courses",
            title: "Course Reports",
            description: "Export course details and enrollment",
            icon: BookOpen,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            id: "departments",
            title: "Department Reports",
            description: "Export department statistics",
            icon: Building2,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-display font-bold tracking-tight">Reports</h1>
                        <p className="text-muted-foreground mt-1">
                            Generate and export comprehensive reports in PDF or Excel format
                        </p>
                    </div>
                    <Badge variant="outline" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Export Center
                    </Badge>
                </div>

                {/* Report Type Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {reportTypes.map((report) => {
                        const Icon = report.icon;
                        return (
                            <Card
                                key={report.id}
                                className={cn(
                                    "cursor-pointer transition-all hover:shadow-lg",
                                    activeTab === report.id && "ring-2 ring-primary"
                                )}
                                onClick={() => setActiveTab(report.id)}
                            >
                                <CardContent className="p-6">
                                    <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mb-4", report.bgColor)}>
                                        <Icon className={cn("h-6 w-6", report.color)} />
                                    </div>
                                    <h3 className="font-semibold mb-1">{report.title}</h3>
                                    <p className="text-sm text-muted-foreground">{report.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Main Report Configuration */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="hidden">
                        {reportTypes.map((report) => (
                            <TabsTrigger key={report.id} value={report.id}>
                                {report.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Attendance Reports */}
                    <TabsContent value="attendance" className="space-y-6">
                        <Card className="shadow-card rounded-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5" />
                                    Attendance Report Configuration
                                </CardTitle>
                                <CardDescription>
                                    Configure filters and export attendance data
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Date Range */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Start Date</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !startDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={startDate}
                                                    onSelect={setStartDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">End Date</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !endDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={endDate}
                                                    onSelect={setEndDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Department Filter */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Department</label>
                                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Departments</SelectItem>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.code}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Format Selection */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Export Format</label>
                                        <Select value={reportFormat} onValueChange={setReportFormat}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                                                <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                                                <SelectItem value="csv">CSV (.csv)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Export Buttons */}
                                <div className="flex gap-3 pt-4 border-t">
                                    <Button
                                        onClick={() => handleExport("Attendance", reportFormat)}
                                        disabled={loading}
                                        className="gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="h-4 w-4" />
                                                Export Report
                                            </>
                                        )}
                                    </Button>
                                    <Button variant="outline" className="gap-2">
                                        <Filter className="h-4 w-4" />
                                        Preview Data
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Students Reports */}
                    <TabsContent value="students" className="space-y-6">
                        <Card className="shadow-card rounded-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Student Report Configuration
                                </CardTitle>
                                <CardDescription>
                                    Export student data, performance metrics, and enrollment details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Department</label>
                                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Departments</SelectItem>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.code}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Semester</label>
                                        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Semesters" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Semesters</SelectItem>
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                                    <SelectItem key={sem} value={sem.toString()}>
                                                        Semester {sem}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Export Format</label>
                                        <Select value={reportFormat} onValueChange={setReportFormat}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                                                <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                                                <SelectItem value="csv">CSV (.csv)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t">
                                    <Button
                                        onClick={() => handleExport("Student", reportFormat)}
                                        disabled={loading}
                                        className="gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="h-4 w-4" />
                                                Export Report
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Courses Reports */}
                    <TabsContent value="courses" className="space-y-6">
                        <Card className="shadow-card rounded-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Course Report Configuration
                                </CardTitle>
                                <CardDescription>
                                    Export course details, enrollment statistics, and faculty assignments
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Department</label>
                                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Departments</SelectItem>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.code}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Semester</label>
                                        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Semesters" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Semesters</SelectItem>
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                                    <SelectItem key={sem} value={sem.toString()}>
                                                        Semester {sem}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Export Format</label>
                                        <Select value={reportFormat} onValueChange={setReportFormat}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                                                <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t">
                                    <Button
                                        onClick={() => handleExport("Course", reportFormat)}
                                        disabled={loading}
                                        className="gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="h-4 w-4" />
                                                Export Report
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Departments Reports */}
                    <TabsContent value="departments" className="space-y-6">
                        <Card className="shadow-card rounded-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Department Report Configuration
                                </CardTitle>
                                <CardDescription>
                                    Export department statistics, faculty count, and student enrollment
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Include Statistics</label>
                                        <Select defaultValue="all">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statistics</SelectItem>
                                                <SelectItem value="students">Student Count Only</SelectItem>
                                                <SelectItem value="faculty">Faculty Count Only</SelectItem>
                                                <SelectItem value="courses">Course Count Only</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Export Format</label>
                                        <Select value={reportFormat} onValueChange={setReportFormat}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                                                <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t">
                                    <Button
                                        onClick={() => handleExport("Department", reportFormat)}
                                        disabled={loading}
                                        className="gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="h-4 w-4" />
                                                Export Report
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Quick Export Section */}
                <Card className="shadow-card rounded-xl border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5" />
                            Quick Export
                        </CardTitle>
                        <CardDescription>
                            Generate commonly used reports with default settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Button
                                variant="outline"
                                className="gap-2 justify-start"
                                onClick={async () => {
                                    const today = new Date();
                                    await handleExport("Attendance", "excel");
                                }}
                                disabled={loading}
                            >
                                <Download className="h-4 w-4" />
                                Today's Attendance
                            </Button>
                            <Button
                                variant="outline"
                                className="gap-2 justify-start"
                                onClick={async () => {
                                    await handleExport("Student", "excel");
                                }}
                                disabled={loading}
                            >
                                <Download className="h-4 w-4" />
                                All Students List
                            </Button>
                            <Button
                                variant="outline"
                                className="gap-2 justify-start"
                                onClick={async () => {
                                    await handleExport("Course", "excel");
                                }}
                                disabled={loading}
                            >
                                <Download className="h-4 w-4" />
                                Course Catalog
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
