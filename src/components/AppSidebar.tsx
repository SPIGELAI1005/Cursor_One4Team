import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Home,
  LayoutDashboard,
  Users2,
  UsersRound,
  CalendarDays,
  CreditCard,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Members", url: "/members", icon: Users2 },
  { title: "Teams", url: "/teams", icon: UsersRound },
  { title: "Schedules", url: "/schedules", icon: CalendarDays },
  { title: "Payments", url: "/payments", icon: CreditCard },
  { title: "Communication", url: "/communication", icon: MessageSquare },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50",
      "transition-colors"
    );

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="items-center py-4">
        <img
          src="/lovable-uploads/d1ec297a-fcb6-4eb3-a917-fee8a903412d.png"
          alt="One4Team logo - sports club management platform"
          className="h-10 w-auto"
          loading="lazy"
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
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

export default AppSidebar;
