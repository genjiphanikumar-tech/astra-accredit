import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ComplianceRing from "@/components/dashboard/ComplianceRing";
import KPICards from "@/components/dashboard/KPICards";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import QuickActions from "@/components/dashboard/QuickActions";
import { useInstitution } from "@/hooks/useInstitution";
import { useCriteria } from "@/hooks/useCriteria";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import InstitutionSetup from "@/components/dashboard/InstitutionSetup";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: institution, isLoading: instLoading } = useInstitution();
  const { data: criteria, isLoading: critLoading } = useCriteria(institution?.id);
  const { gapsCount, evidenceCount, daysToDeadline, isLoading: statsLoading } = useDashboardStats(institution?.id, institution?.submission_deadline);

  if (instLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!institution) {
    return (
      <DashboardLayout title="Dashboard">
        <InstitutionSetup />
      </DashboardLayout>
    );
  }

  const completedCriteria = criteria?.filter(c => (c.completion_percentage ?? 0) >= 100).length ?? 0;
  const totalCriteria = criteria?.length ?? 7;
  const avgCompletion = criteria?.length
    ? Math.round(criteria.reduce((sum, c) => sum + (c.completion_percentage ?? 0), 0) / criteria.length)
    : 0;

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <KPICards
          criteriaCompleted={`${completedCriteria}/${totalCriteria}`}
          evidenceUploaded={String(evidenceCount)}
          gapsIdentified={String(gapsCount)}
          daysToDeadline={daysToDeadline !== null ? String(daysToDeadline) : "—"}
          loading={critLoading || statsLoading}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            <div className="glass-card p-6">
              <h3 className="font-heading text-xs tracking-wider text-muted-foreground uppercase mb-4">
                Criteria Progress
              </h3>
              <div className="space-y-3">
                {(criteria ?? []).map(c => (
                  <div key={c.id} className="flex items-center gap-4">
                    <span className="text-sm w-52 shrink-0">{c.criterion_number}. {c.criterion_name}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${c.completion_percentage ?? 0}%`,
                          background: (c.completion_percentage ?? 0) >= 75 ? "hsl(142,76%,50%)" : (c.completion_percentage ?? 0) >= 50 ? "hsl(40,100%,55%)" : "hsl(0,84%,60%)",
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">{c.completion_percentage ?? 0}%</span>
                  </div>
                ))}
                {!criteria?.length && !critLoading && (
                  <p className="text-sm text-muted-foreground">No criteria set up yet. Add criteria in the NAAC Criteria page.</p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <ComplianceRing percentage={avgCompletion} />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
