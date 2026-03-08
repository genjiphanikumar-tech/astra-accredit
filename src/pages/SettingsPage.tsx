import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl space-y-8">
        {/* Institution Profile */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider">Institution Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Institution Name</Label>
              <Input defaultValue="ABC College of Engineering" className="bg-muted/50 border-border" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">NAAC ID</Label>
              <Input defaultValue="NAAC-2024-1234" className="bg-muted/50 border-border" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Affiliation University</Label>
              <Input defaultValue="XYZ Technological University" className="bg-muted/50 border-border" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Cycle Year</Label>
              <Input defaultValue="2025-26" className="bg-muted/50 border-border" />
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider">API Configuration</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">AI API Key</Label>
              <Input type="password" placeholder="sk-..." className="bg-muted/50 border-border" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Webhook URL (n8n)</Label>
              <Input placeholder="https://..." className="bg-muted/50 border-border" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider">Notification Preferences</h2>
          <p className="text-sm text-muted-foreground">Configure email and in-app notification settings.</p>
        </div>

        <Button className="bg-primary text-primary-foreground gap-2">
          <Save className="h-4 w-4" /> Save Settings
        </Button>
      </div>
    </DashboardLayout>
  );
}
