import { Department } from "@/data/curriculum";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, GraduationCap, UserCheck, Settings } from "lucide-react";

interface DepartmentCardsProps {
  departments: Department[];
  onManage: (department: Department) => void;
}

export function DepartmentCards({ departments, onManage }: DepartmentCardsProps) {
  const totalStudents = departments.reduce((sum, d) => sum + d.totalStudents, 0);
  const totalFaculty = departments.reduce((sum, d) => sum + d.totalFaculty, 0);

  const getDepartmentColor = (index: number) => {
    const colors = [
      "from-primary to-primary/70",
      "from-success to-success/70",
      "from-info to-info/70",
      "from-warning to-warning/70",
      "from-secondary to-secondary/70",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-card rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalStudents.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalFaculty}</p>
                <p className="text-sm text-muted-foreground">Total Faculty</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10">
                <UserCheck className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(totalStudents / totalFaculty)}:1
                </p>
                <p className="text-sm text-muted-foreground">Student-Faculty Ratio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept, index) => {
          const studentPercentage = (dept.totalStudents / totalStudents) * 100;
          
          return (
            <Card
              key={dept.id}
              className="shadow-card rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`h-2 bg-gradient-to-r ${getDepartmentColor(index)}`} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">{dept.name}</h4>
                    <p className="text-sm text-muted-foreground font-mono">
                      {dept.code}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onManage(dept)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Head of Department</span>
                    <span className="font-medium">{dept.head}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-xl font-bold text-primary">
                        {dept.totalStudents}
                      </p>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-xl font-bold text-success">
                        {dept.totalFaculty}
                      </p>
                      <p className="text-xs text-muted-foreground">Faculty</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Student Distribution</span>
                      <span className="font-medium">{studentPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={studentPercentage} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
