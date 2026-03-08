import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import { Bell, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth();
  const { data: notifications } = useNotifications();
  const navigate = useNavigate();
  const unreadCount = notifications?.filter(n => !n.is_read).length ?? 0;

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              {title && (
                <h1 className="font-heading text-sm font-semibold tracking-wide">
                  {title}
                </h1>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={handleSignOut} title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center" title={profile?.display_name ?? "User"}>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              {profile?.display_name && (
                <span className="text-xs text-muted-foreground hidden md:inline">{profile.display_name}</span>
              )}
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
