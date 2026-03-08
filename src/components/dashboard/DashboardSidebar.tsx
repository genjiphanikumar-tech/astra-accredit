import {
  LayoutDashboard, Database, ClipboardCheck, Search, FileText,
  ListTodo, Clock, Archive, Settings, Home, Bot
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Data Sources", url: "/data-sources", icon: Database },
  { title: "NAAC Criteria", url: "/criteria", icon: ClipboardCheck },
  { title: "Gap Analysis", url: "/gap-analysis", icon: Search },
  { title: "SAR Generator", url: "/sar-generator", icon: FileText },
  { title: "Tasks", url: "/tasks", icon: ListTodo },
  { title: "Countdown", url: "/countdown", icon: Clock },
  { title: "Reports", url: "/reports", icon: Archive },
  { title: "AI Assistant", url: "/chat", icon: Bot },
  { title: "Settings", url: "/settings", icon: Settings },
];

export default function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-heading text-xs tracking-wider">
            {!collapsed && "Autoscale AI"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" end activeClassName="nav-active">
                    <Home className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Home</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      activeClassName="nav-active"
                      className="hover:bg-muted/50"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
