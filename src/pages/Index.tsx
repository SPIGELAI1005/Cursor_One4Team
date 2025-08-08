import { Helmet } from "react-helmet-async";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useI18n } from "@/i18n/I18nProvider";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const revenueData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1800 },
  { month: "Mar", revenue: 2200 },
  { month: "Apr", revenue: 2600 },
  { month: "May", revenue: 3100 },
  { month: "Jun", revenue: 4000 },
];

const activityData = [
  { name: "U8", value: 30 },
  { name: "U12", value: 25 },
  { name: "U16", value: 20 },
  { name: "Seniors", value: 25 },
];

const Index = () => {
  const [date] = useState<Date | undefined>(new Date());
  const { t } = useI18n();


  return (
    <SidebarProvider>
      <Helmet>
        <title>One4Team Dashboard – Sports Club Management</title>
        <meta
          name="description"
          content="Run your sports club smarter with One4Team. Dashboard for memberships, payments, schedules, and communication."
        />
        <link rel="canonical" href={window.location.origin + "/"} />
      </Helmet>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="flex h-14 items-center gap-2 px-4">
              <SidebarTrigger />
              <div className="relative ml-2 flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder={t("header.search")}
                  aria-label="Search"
                />
              </div>
              <LanguageToggle />
              <ThemeToggle />
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0" aria-label="User menu">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>O4T</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="z-50 bg-popover text-popover-foreground shadow-lg">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="p-4 md:p-6 space-y-6 min-w-0">
            <section
              className="rounded-xl overflow-hidden border"
              aria-label="Welcome hero"
            >
              <div
                className="h-40 md:h-56 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('/lovable-uploads/443c4c6f-adfe-44a3-af41-0e491753fbe6.png')",
                }}
                role="img"
                aria-label="Sunset sports scene background"
              />
              <div className="p-4 md:p-6 bg-gradient-to-t from-background/90 to-background/60">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {t("index.hero.title")}
                </h1>
                <p className="text-muted-foreground">
                  {t("index.hero.sub")}
                </p>
              </div>
            </section>

            <section className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("index.card.members")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">1,248</div>
                  <p className="text-sm text-muted-foreground">+3.2% vs last month</p>
                </CardContent>
              </Card>
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle>{t("index.card.revenue")}</CardTitle>
                </CardHeader>
                <CardContent className="h-56 min-w-0">
                  <ChartContainer config={{ revenue: { label: "Revenue", color: "hsl(var(--primary))" } }}>
                    <ResponsiveContainer>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t("index.card.todo")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[t("index.todo.1"), t("index.todo.2"), t("index.todo.3")].map((tlabel) => (
                    <label key={tlabel} className="flex items-start gap-3 text-sm">
                      <Checkbox id={tlabel} />
                      <span className="leading-5">{tlabel}</span>
                    </label>
                  ))}
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{t("index.card.upcoming")}</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-6 flex-col md:flex-row min-w-0">
                  <Calendar mode="single" selected={date} className="rounded-md border" />
                  <div className="flex-1 space-y-3 min-w-0">
                    <div className="text-sm">Today, 18:00 – U16 Fitness</div>
                    <div className="text-sm">Tomorrow, 17:30 – Seniors Match Prep</div>
                    <div className="text-sm">Fri, 16:00 – U12 Drills</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t("index.card.activity")}</CardTitle>
                </CardHeader>
                <CardContent className="h-64 min-w-0">
                  <ChartContainer config={{ u8: { color: "hsl(var(--primary))" }, u12: { color: "hsl(var(--secondary))" } }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={activityData} dataKey="value" nameKey="name" outerRadius={80}>
                          {activityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))"} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </section>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
