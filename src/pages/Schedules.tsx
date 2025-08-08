import { Helmet } from "react-helmet-async";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useI18n } from "@/i18n/I18nProvider";

const Schedules = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { t } = useI18n();

  return (
    <SidebarProvider>
      <Helmet>
        <title>Club Schedules – One4Team</title>
        <meta name="description" content="View and manage your club training sessions and match schedules with One4Team." />
        <link rel="canonical" href={window.location.origin + "/schedules"} />
      </Helmet>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="flex h-14 items-center gap-2 px-4">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">{t("schedules.title")}</h1>
              <div className="ml-auto flex items-center gap-2"><LanguageToggle /><ThemeToggle /></div>
            </div>
          </header>

          <main className="p-4 md:p-6 space-y-6">
            <section className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("schedules.selectDate")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("schedules.upcoming")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>{t("schedules.item.1")}</div>
                  <div>{t("schedules.item.2")}</div>
                  <div>{t("schedules.item.3")}</div>
                </CardContent>
              </Card>
            </section>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Schedules;
