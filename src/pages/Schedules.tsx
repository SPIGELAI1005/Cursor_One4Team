import { Helmet } from "react-helmet-async";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useI18n } from "@/i18n/I18nProvider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Select>
                      <SelectTrigger className="w-40"><SelectValue placeholder="Team" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Teams</SelectItem>
                        <SelectItem value="u12">U12</SelectItem>
                        <SelectItem value="u16">U16</SelectItem>
                        <SelectItem value="seniors">Seniors</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-44"><SelectValue placeholder="Location" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="away">Away</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="overflow-x-auto -mx-2">
                    <Table className="min-w-[520px] mx-2">
                      <TableHeader className="sticky top-0 z-10 bg-background">
                        <TableRow>
                          <TableHead>Event</TableHead>
                          <TableHead className="w-40">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>{t("schedules.item.1")}</TableCell>
                          <TableCell><Badge variant="secondary">Practice</Badge></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>{t("schedules.item.2")}</TableCell>
                          <TableCell><Badge>Match</Badge></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>{t("schedules.item.3")}</TableCell>
                          <TableCell><Badge variant="outline">Drills</Badge></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
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
