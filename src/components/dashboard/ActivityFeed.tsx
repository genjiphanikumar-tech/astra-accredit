import { motion } from "framer-motion";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityFeed() {
  const { data: notifications, isLoading } = useNotifications();

  return (
    <div className="glass-card p-4 h-full">
      <h3 className="font-heading text-xs tracking-wider text-muted-foreground uppercase mb-4">
        Live Activity
      </h3>
      <div className="space-y-3">
        {isLoading && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 pb-3 border-b border-border/50">
            <Skeleton className="h-2 w-2 rounded-full mt-1.5" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
        {!isLoading && (!notifications?.length ? (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0"
            >
              <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0 glow-dot" />
              <div>
                <p className="text-sm leading-snug">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          ))
        ))}
      </div>
    </div>
  );
}
