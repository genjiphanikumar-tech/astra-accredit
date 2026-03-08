import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Clock, GripVertical, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useInstitution } from "@/hooks/useInstitution";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Task = Tables<"tasks">;

const COLUMNS = [
  { key: "todo", label: "To Do", accent: "border-muted-foreground/30" },
  { key: "in_progress", label: "In Progress", accent: "border-primary/30" },
  { key: "review", label: "Review", accent: "border-secondary/30" },
  { key: "done", label: "Done", accent: "border-green-500/30" },
] as const;

type ColumnKey = (typeof COLUMNS)[number]["key"];

const priorityStyles: Record<string, string> = {
  high: "border-destructive/60 text-destructive",
  medium: "border-secondary/60 text-secondary",
  low: "border-muted-foreground/60 text-muted-foreground",
};

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newDepartment, setNewDepartment] = useState("");

  const { data: institution } = useInstitution();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!institution?.id) return;
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("institution_id", institution.id)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to fetch tasks:", error);
      return;
    }
    setTasks(data || []);
    setLoading(false);
  }, [institution?.id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Realtime subscription
  useEffect(() => {
    if (!institution?.id) return;

    const channel = supabase
      .channel("tasks-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks", filter: `institution_id=eq.${institution.id}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTasks((prev) => [payload.new as Task, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setTasks((prev) =>
              prev.map((t) => (t.id === (payload.new as Task).id ? (payload.new as Task) : t))
            );
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) => prev.filter((t) => t.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [institution?.id]);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
    // Add a small delay for the visual effect
    const el = e.currentTarget as HTMLElement;
    setTimeout(() => el.style.opacity = "0.4", 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = "1";
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnKey);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedTaskId) return;

    const task = tasks.find((t) => t.id === draggedTaskId);
    if (!task || task.status === columnKey) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === draggedTaskId ? { ...t, status: columnKey } : t))
    );

    const { error } = await supabase
      .from("tasks")
      .update({ status: columnKey })
      .eq("id", draggedTaskId);

    if (error) {
      toast({ title: "Failed to move task", description: error.message, variant: "destructive" });
      fetchTasks(); // revert
    }
  };

  // Add task
  const handleAddTask = async () => {
    if (!newTitle.trim() || !institution?.id || !user?.id) return;
    setSubmitting(true);

    const { error } = await supabase.from("tasks").insert({
      title: newTitle.trim(),
      description: newDescription.trim() || null,
      priority: newPriority,
      department: newDepartment.trim() || null,
      status: "todo",
      institution_id: institution.id,
      assigned_to: user.id,
    });

    if (error) {
      toast({ title: "Failed to create task", description: error.message, variant: "destructive" });
    } else {
      setNewTitle("");
      setNewDescription("");
      setNewPriority("medium");
      setNewDepartment("");
      setAddOpen(false);
      toast({ title: "Task created" });
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <DashboardLayout title="Task Management">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Task Management">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-3 w-3" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-heading">New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Task title" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Optional description" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={newPriority} onValueChange={setNewPriority}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)} placeholder="e.g. IQAC" />
                  </div>
                </div>
                <Button onClick={handleAddTask} disabled={!newTitle.trim() || submitting} className="w-full">
                  {submitting ? "Creating…" : "Create Task"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.key);
            const isOver = dragOverColumn === col.key;

            return (
              <div
                key={col.key}
                className="space-y-3"
                onDragOver={(e) => handleDragOver(e, col.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.key)}
              >
                <div className={`flex items-center gap-2 pb-2 border-b-2 ${col.accent}`}>
                  <h3 className="font-heading text-xs uppercase tracking-wider">{col.label}</h3>
                  <span className="text-xs text-muted-foreground">({columnTasks.length})</span>
                </div>

                <div
                  className={`space-y-2 min-h-[200px] rounded-lg transition-colors p-1 ${
                    isOver ? "bg-primary/5 ring-1 ring-primary/20" : ""
                  }`}
                >
                  {columnTasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, task.id)}
                      onDragEnd={(e) => handleDragEnd(e as unknown as React.DragEvent)}
                      className={`glass-card p-3 space-y-2 cursor-grab active:cursor-grabbing hover:border-primary/20 transition-all ${
                        draggedTaskId === task.id ? "opacity-40" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium leading-snug truncate">{task.title}</p>
                            <span
                              className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] border ${
                                priorityStyles[task.priority || "medium"]
                              }`}
                            >
                              {task.priority || "medium"}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                          )}
                          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                            <span>{task.department || "General"}</span>
                            {task.due_date && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(task.due_date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="flex items-center justify-center h-24 text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
