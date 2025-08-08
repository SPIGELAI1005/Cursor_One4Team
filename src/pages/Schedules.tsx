import { Helmet } from "react-helmet-async";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const Schedules = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

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
              <h1 className="text-lg font-semibold">Schedules</h1>
              <div className="ml-auto"><ThemeToggle /></div>
            </div>
          </header>

          <main className="p-4 md:p-6 space-y-6">
            <section className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>Today, 18:00 – U16 Fitness</div>
                  <div>Tomorrow, 17:30 – Seniors Match Prep</div>
                  <div>Fri, 16:00 – U12 Drills</div>
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
