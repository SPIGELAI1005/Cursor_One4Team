import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CheckCircle2, Shield, Smartphone, Zap, Menu } from "lucide-react";
import BrandName from "@/components/BrandName";
import HeroImageLoop from "@/components/HeroImageLoop";

const Landing = () => {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'One4Team',
    url: window.location.origin,
    logo: window.location.origin + '/lovable-uploads/708afae6-09f9-40e1-b977-18f42b832348.png'
  };

  const [slide, setSlide] = useState(0);
   const progressRef = useRef<HTMLDivElement | null>(null);
   const statsRef = useRef<HTMLDivElement | null>(null);
   const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % 2), 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.width = "0%";
    void el.offsetWidth; // force reflow
    el.style.transition = "width 3000ms linear";
    el.style.width = "100%";
   }, [slide]);

   useEffect(() => {
     const observer = new IntersectionObserver(([entry]) => {
       if (entry.isIntersecting) {
         setStatsInView(true);
         observer.disconnect();
       }
     }, { threshold: 0.2 });
     if (statsRef.current) observer.observe(statsRef.current);
     return () => observer.disconnect();
   }, []);

  return (
    <>
      <Helmet>
        <title>One4Team – Sports Club Management Platform</title>
        <meta name="description" content="Run your sports club smarter with One4Team. Memberships, payments, schedules and communication in one platform." />
        <link rel="canonical" href={window.location.origin + "/"} />
        <meta property="og:title" content="One4Team – Sports Club Management Platform" />
        <meta property="og:description" content="Run your sports club Smarter. Memberships, payments, schedules and communication in one platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.origin + "/"} />
        <meta property="og:image" content={window.location.origin + "/lovable-uploads/e754b695-0c4d-4d3c-9144-a0bd29d4c8e0.png"} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preload" as="image" href="/lovable-uploads/f7fa8228-e4e5-4d57-9ef5-8a3452f44a83.png" />
        <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
      </Helmet>

      <header className="fixed inset-x-0 top-0 z-50 border-b bg-[hsl(var(--header))]/90 text-[hsl(var(--header-foreground))] backdrop-blur">
        <div className="container mx-auto relative flex h-14 items-center justify-between px-4">
          <div className="absolute right-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu" className="text-[hsl(var(--primary))] hover:text-[hsl(var(--secondary))]">
                  <Menu className="h-7 w-7" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 border-l border-[hsl(var(--primary))]/40">
                <nav className="mt-6 grid gap-4 text-base">
                  <a href="#features" className="text-[hsl(var(--primary))] hover:text-[hsl(var(--secondary))] transition-colors">Features</a>
                  <a href="#why" className="text-[hsl(var(--primary))] hover:text-[hsl(var(--secondary))] transition-colors">Why One4Team</a>
                  <a href="#testimonials" className="text-[hsl(var(--primary))] hover:text-[hsl(var(--secondary))] transition-colors">Testimonials</a>
                  <a href="#pricing" className="text-[hsl(var(--primary))] hover:text-[hsl(var(--secondary))] transition-colors">Pricing</a>
                  <Link to="/dashboard" className="font-medium text-[hsl(var(--secondary))] hover:underline">Go to Dashboard</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-2">
            <img
              src="/lovable-uploads/85fc7aa9-a7bc-4a2a-8e5e-6e60551ded1e.png"
              alt="One4Team logo"
              className="h-7 md:h-7 lg:h-8 w-auto mx-auto md:mx-0"
              loading="eager"
              decoding="async"
            />
          </div>
          <nav className="hidden md:flex items-center md:gap-4 lg:gap-6 md:text-xs lg:text-sm text-[hsl(var(--header-foreground))]/80" aria-label="Primary">
            <a href="#features" className="hover:text-[hsl(var(--header-foreground))] transition-colors">Features</a>
            <a href="#why" className="hover:text-[hsl(var(--header-foreground))] transition-colors">Why One4Team</a>
            <a href="#testimonials" className="hover:text-[hsl(var(--header-foreground))] transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-[hsl(var(--header-foreground))] transition-colors">Pricing</a>
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="default">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-14">
        {/* Hero */}
        <section className="container mx-auto px-4 pt-2 md:pt-4 pb-12 md:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold tracking-tight">
                <span className="whitespace-nowrap">Run your sports club</span>
                <br />
                <span className="gold-gradient-text">Smarter</span>
              </h1>
              <div className="mt-4 text-muted-foreground max-w-xl">
                <p className="text-sm md:hidden">
                  Memberships. Payments. Communication.
                  <span className="block">One platform. Built for clubs of any size.</span>
                </p>
                <p className="hidden md:block text-sm lg:text-lg">
                  Memberships. Payments. Communication.
                  <span className="block">One platform. Built for clubs of any size.</span>
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/dashboard">
                  <Button size="lg">Start Free Trial</Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="outline">See Features</Button>
                </a>
              </div>
              <div className="mt-6 flex gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> GDPR compliant</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Bank‑level security</span>
              </div>
            </div>
            <div className="w-full md:max-w-[560px] lg:max-w-[640px] mx-auto">
              <div className="relative">
                <div className="rounded-xl overflow-hidden shadow-md">
                  <HeroImageLoop
                    images={[
                      { src: "/lovable-uploads/f8e1ec68-8d16-43e9-9bd2-c08ff09b9a51.png", alt: "One4Team Scene – Part 1" },
                      { src: "/lovable-uploads/995a1999-b3c9-44db-b414-ef702e8fc559.png", alt: "One4Team Scene – Part 2" },
                    ]}
                    intervalMs={7000}
                    transitionMs={900}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container mx-auto px-4 pt-2 md:pt-4 pb-8 md:pb-12">
          <h2 className="text-center text-2xl md:text-4xl font-bold">Everything your club needs in <span className="gold-gradient-text">one place</span></h2>
          <p className="mt-1 md:mt-2 text-left text-sm text-muted-foreground max-w-2xl mx-auto">From member management to financial tracking, <BrandName className="font-bold inline" /> provides all the tools you need to run your club efficiently.</p>
          <div className="mt-6 md:mt-10 grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Members', desc: 'Manage member profiles, registrations, and club hierarchy with ease.' },
              { title: 'Payments & Invoices', desc: 'Automated billing, payment tracking, and financial reporting.' },
              { title: 'Communication Tools', desc: 'Announcements, messaging, and notifications to keep everyone aligned.' },
              { title: 'Team Shop', desc: 'Sell merchandise, equipment, and tickets directly through your platform.' },
              { title: 'Website Builder', desc: 'Create a professional club website without technical knowledge.' },
              { title: 'Reports', desc: 'Insights into membership trends, finances, and performance.' },
            ].map((f) => (
              <Card key={f.title} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="gold-gradient-text text-sm md:text-lg">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Why choose */}
        <section id="why" className="bg-muted/40">
          <div className="container mx-auto px-4 py-8 md:py-10 grid gap-4 md:gap-6 md:grid-cols-2">
            {/* Title & intro spans both columns to align content rows */}
            <div className="md:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold">Why choose <BrandName />?</h2>
              <p className="mt-2 text-muted-foreground text-sm md:text-base max-w-2xl">
                Built specifically for sports clubs, by people who understand the unique challenges of club management.
              </p>
            </div>

            {/* Left: Feature bullets */}
            <div>
              <ul className="mt-2 space-y-3">
                {[
                  { title: 'Centralized club administration', desc: 'All your club operations in one unified platform', Icon: Zap },
                  { title: 'Easy for everyone', desc: 'Intuitive interface that anyone can use without training', Icon: Smartphone },
                  { title: 'GDPR-compliant and secure', desc: 'Bank‑level security with full compliance guarantee', Icon: Shield },
                  { title: 'Works on all devices', desc: 'Perfect experience on desktop, tablet and mobile', Icon: CheckCircle2 },
                ].map(({ title, desc, Icon }) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-muted text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="font-semibold text-sm md:text-base">{title}</p>
                      <p className="text-muted-foreground text-xs md:text-sm leading-snug">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Metrics cards */}
            <div ref={statsRef} className="rounded-2xl border bg-card p-2 md:p-4">
              <div className="grid gap-2 md:gap-3 sm:grid-cols-2">
                {[
                  { title: 'Number of Members', value: '87%' },
                  { title: 'Matches Planned vs. Played', value: '92%' },
                  { title: 'Number of Tickets Sold', value: '78%' },
                  { title: 'Items in Shop', value: '65%' },
                ].map((m) => (
                  <Card key={m.title} className="bg-muted/10 shadow-none border-none">
                    <CardHeader className="pb-1 pt-2">
                      <CardTitle className="text-xs md:text-sm font-semibold">{m.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xl md:text-2xl font-bold">{m.value}</div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                        <div className="h-1.5 rounded-full gold-gradient-bg transition-[width] duration-700 ease-out" style={{ width: statsInView ? m.value : '0%' }} aria-hidden />
                      </div>
                      <p className="mt-0.5 text-[10px] md:text-[11px] text-muted-foreground">{m.value} complete</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="container mx-auto px-4 py-10 md:py-12">
          <h2 className="text-center text-2xl md:text-4xl font-bold">Trusted by clubs <span className="gold-gradient-text">everywhere</span></h2>
          <p className="mt-2 text-center text-sm text-muted-foreground max-w-2xl mx-auto">See what club managers are saying about <BrandName className="font-bold" />.</p>

          <div className="mt-10 grid gap-4 md:gap-6 md:grid-cols-3">
            {/* Testimonial 1 */}
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex gold-gradient-text" aria-label="5 star rating">{'★★★★★'}</div>
                <blockquote className="mt-3 text-sm text-muted-foreground italic">
                  &ldquo;<BrandName className="font-bold inline" /> has revolutionized the way we manage our club. Everything is now in one place – memberships, payments, communication. It's a real game‑changer!&rdquo;
                </blockquote>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10"><AvatarFallback>MS</AvatarFallback></Avatar>
                  <div>
                    <p className="text-sm font-semibold">Maria Schmidt</p>
                    <p className="text-xs text-muted-foreground">Club Manager</p>
                    <p className="text-xs text-muted-foreground">FC Grün‑Weiss Grobenzell</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex gold-gradient-text" aria-label="5 star rating">{'★★★★★'}</div>
                <blockquote className="mt-3 text-sm text-muted-foreground italic">
                  "The platform is incredibly intuitive. Our members love the simple registration process and our admin team saves hours every week on manual tasks."
                </blockquote>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10"><AvatarFallback>TW</AvatarFallback></Avatar>
                  <div>
                    <p className="text-sm font-semibold">Thomas Weber</p>
                    <p className="text-xs text-muted-foreground">President</p>
                    <p className="text-xs text-muted-foreground">TSV 1860 München</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex gold-gradient-text" aria-label="5 star rating">{'★★★★★'}</div>
                <blockquote className="mt-3 text-sm text-muted-foreground italic">
                  "Finally a solution that understands sports clubs! Payment tracking and member management are exactly what we needed."
                </blockquote>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10"><AvatarFallback>AM</AvatarFallback></Avatar>
                  <div>
                    <p className="text-sm font-semibold">Anna Müller</p>
                    <p className="text-xs text-muted-foreground">Treasurer</p>
                    <p className="text-xs text-muted-foreground">SV München Untermenzing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logos row */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">Join 500+ clubs that already use <BrandName className="font-bold" /></p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 md:flex-row md:flex-wrap md:justify-center md:gap-4">
              {[
                "TSV Allach 09",
                "FC Grün-Weiss Gröbenzell",
                "FC Augsburg",
                "1860 München",
              ].map((name) => (
                <div
                  key={name}
                  className="group relative w-full max-w-xs text-center rounded-xl bg-muted/30 px-5 py-3 shadow-sm transition-all duration-300 hover:rounded-full hover:shadow-md hover:scale-105"
                >
                  <div
                    className="pointer-events-none absolute inset-0 rounded-full gold-gradient-bg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                  <span className="relative z-10 text-sm text-muted-foreground transition-colors group-hover:text-[hsl(var(--primary-foreground))]">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="pricing" className="py-12 md:py-16 bg-primary/15">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-bold">Ready to transform your sports club?</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">Join clubs already using <BrandName className="font-bold inline" /> to streamline operations and grow their membership.</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link to="/dashboard"><Button size="lg">Start Free Trial</Button></Link>
              <a href="#features"><Button size="lg" variant="outline">Contact Sales</Button></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-[hsl(var(--header))] text-[hsl(var(--header-foreground))]">
          <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 md:grid-rows-[auto_auto_auto_auto] items-center md:items-start justify-items-center md:justify-items-start text-center md:text-left">
            {/* Left-side large logo with tagline */}
            <div className="md:col-start-1 md:row-span-4 flex flex-col items-center justify-center gap-3 md:flex-row md:items-center md:justify-start md:gap-4">
              <img src="/lovable-uploads/708afae6-09f9-40e1-b977-18f42b832348.png" alt="One4Team logo" className="h-32 md:h-48 w-auto" loading="lazy" />
              <p className="text-sm text-muted-foreground whitespace-normal md:whitespace-nowrap text-center">One Platform. For your Team.</p>
            </div>

            {/* Product column as grid rows */}
            <h3 className="font-semibold md:col-start-2 md:row-start-1">Product</h3>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground md:col-start-2 md:row-start-2">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground md:col-start-2 md:row-start-3">Pricing</a>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground md:col-start-2 md:row-start-4">Get Started</Link>

            {/* Company column as grid rows */}
            <h3 className="font-semibold md:col-start-3 md:row-start-1">Company</h3>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground md:col-start-3 md:row-start-2">About</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground md:col-start-3 md:row-start-3">Privacy Policy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground md:col-start-3 md:row-start-4">Legal Notice</a>
          </div>
        <div className="border-t py-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} One4Team. All rights reserved.</div>
      </footer>
    </>
  );
};

export default Landing;
