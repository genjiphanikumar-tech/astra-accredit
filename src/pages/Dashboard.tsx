import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ComplianceRing from "@/components/dashboard/ComplianceRing";
import KPICards from "@/components/dashboard/KPICards";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import QuickActions from "@/components/dashboard/QuickActions";

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <KPICards />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            {/* Criteria overview placeholder */}
            <div className="glass-card p-6">
              <h3 className="font-heading text-xs tracking-wider text-muted-foreground uppercase mb-4">
                Criteria Progress
              </h3>
              <div className="space-y-3">
                {[
                  { name: "1. Curricular Aspects", pct: 85 },
                  { name: "2. Teaching-Learning", pct: 72 },
                  { name: "3. Research & Innovation", pct: 60 },
                  { name: "4. Infrastructure", pct: 90 },
                  { name: "5. Student Support", pct: 45 },
                  { name: "6. Governance", pct: 78 },
                  { name: "7. Institutional Values", pct: 55 },
                ].map(c => (
                  <div key={c.name} className="flex items-center gap-4">
                    <span className="text-sm w-52 shrink-0">{c.name}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${c.pct}%`,
                          background: c.pct >= 75 ? "hsl(142,76%,50%)" : c.pct >= 50 ? "hsl(40,100%,55%)" : "hsl(0,84%,60%)",
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <ComplianceRing percentage={68} />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
