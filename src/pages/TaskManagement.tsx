import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Clock, AlertTriangle } from "lucide-react";

interface Task {
  id: number;
  title: string;
  dept: string;
  assignee: string;
  criterion: string;
  due: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "inprogress" | "review" | "done";
}

const initialTasks: Task[] = [
  { id: 1, title: "Upload placement statistics", dept: "Placement", assignee: "Dr. Patel", criterion: "C5", due: "2026-03-15", priority: "high", status: "todo" },
  { id: 2, title: "Compile research papers list", dept: "Research", assignee: "Dr. Singh", criterion: "C3", due: "2026-03-12", priority: "high", status: "inprogress" },
  { id: 3, title: "Submit alumni survey results", dept: "IQAC", assignee: "Prof. Kumar", criterion: "C5", due: "2026-03-20", priority: "medium", status: "todo" },
  { id: 4, title: "Review CO-PO mapping for ECE", dept: "ECE", assignee: "Dr. Rao", criterion: "C2", due: "2026-03-18", priority: "medium", status: "review" },
  { id: 5, title: "Upload infrastructure photos", dept: "Admin", assignee: "Mr. Reddy", criterion: "C4", due: "2026-03-10", priority: "low", status: "done" },
  { id: 6, title: "Green audit report", dept: "Admin", assignee: "Dr. Sharma", criterion: "C7", due: "2026-03-25", priority: "high", status: "todo" },
];

const columns = [
  { key: "todo", label: "To Do", color: "border-muted-foreground/30" },
  { key: "inprogress", label: "In Progress", color: "border-primary/30" },
  { key: "review", label: "Review", color: "border-secondary/30" },
  { key: "done", label: "Done", color: "border-success/30" },
];

const priorityStyles: Record<string, string> = {
  high: "status-gap",
  medium: "status-partial",
  low: "status-not-started",
};

export default function TaskManagement() {
  const [tasks] = useState(initialTasks);

  return (
    <DashboardLayout title="Task Management">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button size="sm" className="bg-primary text-primary-foreground gap-2">
            <Plus className="h-3 w-3" /> Add Task
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map(col => (
            <div key={col.key} className="space-y-3">
              <div className={`flex items-center gap-2 pb-2 border-b-2 ${col.color}`}>
                <h3 className="font-heading text-xs uppercase tracking-wider">{col.label}</h3>
                <span className="text-xs text-muted-foreground">
                  ({tasks.filter(t => t.status === col.key).length})
                </span>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {tasks.filter(t => t.status === col.key).map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-3 space-y-2 cursor-pointer hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug">{task.title}</p>
                      <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] border ${priorityStyles[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{task.dept} • {task.criterion}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {task.due.split("-").slice(1).join("/")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{task.assignee}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
