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
import { useI18n } from "@/i18n/I18nProvider";
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
  const { t } = useI18n();
  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50",
      "transition-colors"
    );

  const labelForUrl = (url: string) => {
    switch (url) {
      case "/": return t("sidebar.home");
      case "/dashboard": return t("sidebar.dashboard");
      case "/members": return t("sidebar.members");
      case "/teams": return t("sidebar.teams");
      case "/schedules": return t("sidebar.schedules");
      case "/payments": return t("sidebar.payments");
      case "/communication": return t("sidebar.communication");
      case "/reports": return t("sidebar.reports");
      case "/settings": return t("sidebar.settings");
      default: return url;
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="items-center py-4">
        <img
          src="/lovable-uploads/708afae6-09f9-40e1-b977-18f42b832348.png"
          alt="One4Team logo - sports club management platform"
          className="h-10 w-auto"
          loading="lazy"
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.main")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{labelForUrl(item.url)}</span>
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
