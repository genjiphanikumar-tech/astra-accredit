import { Button } from "@/components/ui/button";
import { FileText, Search, ListTodo } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="glass-card p-4">
      <h3 className="font-heading text-xs tracking-wider text-muted-foreground uppercase mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          variant="outline"
          className="border-primary/20 text-primary hover:bg-primary/10 gap-2 justify-start"
          onClick={() => navigate("/sar-generator")}
        >
          <FileText className="h-4 w-4" /> Generate Report
        </Button>
        <Button
          variant="outline"
          className="border-secondary/20 text-secondary hover:bg-secondary/10 gap-2 justify-start"
          onClick={() => navigate("/gap-analysis")}
        >
          <Search className="h-4 w-4" /> Run Gap Analysis
        </Button>
        <Button
          variant="outline"
          className="border-amber/20 text-amber hover:bg-amber/5 gap-2 justify-start"
          onClick={() => navigate("/tasks")}
        >
          <ListTodo className="h-4 w-4" /> Assign Tasks
        </Button>
      </div>
    </div>
  );
}
