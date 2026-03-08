import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import { Database, RefreshCw, Plus, Loader2, Trash2, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstitution } from "@/hooks/useInstitution";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DataSources() {
  const { data: institution } = useInstitution();
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ source_name: "", api_endpoint: "", api_key: "" });

  // Fetch data sources
  const { data: sources, isLoading } = useQuery({
    queryKey: ["data_sources", institution?.id],
    enabled: !!institution?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("data_sources")
        .select("*")
        .eq("institution_id", institution!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Add data source
  const addMutation = useMutation({
    mutationFn: async () => {
      if (!institution) throw new Error("No institution");

      // Test Moodle connection first
      if (form.source_name.toLowerCase().includes("moodle") || form.source_name.toLowerCase().includes("lms")) {
        const resp = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/moodle-sync`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              moodleUrl: form.api_endpoint,
              apiToken: form.api_key,
              action: "test",
            }),
          }
        );
        const result = await resp.json();
        if (!result.success) throw new Error(result.error || "Connection test failed");
        toast.success(`Connected to ${result.siteName}`);
      }

      const { error } = await supabase.from("data_sources").insert({
        institution_id: institution.id,
        source_name: form.source_name,
        api_endpoint: form.api_endpoint,
        api_key: form.api_key,
        is_connected: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Data source added");
      queryClient.invalidateQueries({ queryKey: ["data_sources"] });
      setAddOpen(false);
      setForm({ source_name: "", api_endpoint: "", api_key: "" });
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: async (source: any) => {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/moodle-sync`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            moodleUrl: source.api_endpoint,
            apiToken: source.api_key,
            action: "sync",
          }),
        }
      );
      const result = await resp.json();
      if (!result.success) throw new Error(result.error || "Sync failed");

      // Update records count and last_synced_at
      await supabase
        .from("data_sources")
        .update({
          records_count: result.records,
          last_synced_at: new Date().toISOString(),
          is_connected: true,
        })
        .eq("id", source.id);

      return result;
    },
    onSuccess: (result) => {
      toast.success(`Synced ${result.records} records (${Object.entries(result.details).map(([k, v]) => `${v} ${k}`).join(", ")})`);
      queryClient.invalidateQueries({ queryKey: ["data_sources"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("data_sources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Data source removed");
      queryClient.invalidateQueries({ queryKey: ["data_sources"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <DashboardLayout title="Data Sources">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Connect external systems to pull institutional data for accreditation.
          </p>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-3 w-3" /> Add Source
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect Data Source</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label>Source Name</Label>
                  <Input
                    value={form.source_name}
                    onChange={e => setForm(p => ({ ...p, source_name: e.target.value }))}
                    placeholder="e.g. Moodle LMS, ERP System"
                  />
                </div>
                <div>
                  <Label>API Endpoint / URL</Label>
                  <Input
                    value={form.api_endpoint}
                    onChange={e => setForm(p => ({ ...p, api_endpoint: e.target.value }))}
                    placeholder="e.g. https://moodle.yourinstitution.edu"
                  />
                </div>
                <div>
                  <Label>API Key / Token</Label>
                  <Input
                    type="password"
                    value={form.api_key}
                    onChange={e => setForm(p => ({ ...p, api_key: e.target.value }))}
                    placeholder="Enter your API token"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    For Moodle: Site Admin → Plugins → Web Services → Manage tokens
                  </p>
                </div>
                <Button
                  onClick={() => addMutation.mutate()}
                  disabled={!form.source_name || !form.api_endpoint || !form.api_key || addMutation.isPending}
                  className="w-full"
                >
                  {addMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Testing & Connecting...</>
                  ) : (
                    "Test & Connect"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-40" />)}
          </div>
        ) : !sources || sources.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted-foreground">
            <Database className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p>No data sources connected yet.</p>
            <p className="text-xs mt-1">Click "Add Source" to connect your Moodle LMS or other systems.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sources.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-heading text-sm font-semibold">{s.source_name}</h3>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {s.api_endpoint}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {s.is_connected ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    Last sync: {s.last_synced_at
                      ? new Date(s.last_synced_at).toLocaleDateString()
                      : "Never"}
                  </div>
                  <div>Records: {(s.records_count ?? 0).toLocaleString()}</div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-primary/20 text-primary hover:bg-primary/10 gap-2"
                    onClick={() => syncMutation.mutate(s)}
                    disabled={syncMutation.isPending}
                  >
                    {syncMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3 w-3" />
                    )}
                    Sync
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => deleteMutation.mutate(s.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
