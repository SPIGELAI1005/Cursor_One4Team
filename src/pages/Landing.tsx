import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CheckCircle2, Shield, Smartphone, Zap } from "lucide-react";
import BrandName from "@/components/BrandName";

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

      <header className="border-b bg-[hsl(var(--header))] text-[hsl(var(--header-foreground))]">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img
              src="/lovable-uploads/85fc7aa9-a7bc-4a2a-8e5e-6e60551ded1e.png"
              alt="One4Team logo"
              className="h-8 w-auto"
              loading="eager"
              decoding="async"
            />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[hsl(var(--header-foreground))]/80" aria-label="Primary">
            <a href="#features" className="hover:text-[hsl(var(--header-foreground))] transition-colors">Features</a>
            <a href="#why" className="hover:text-[hsl(var(--header-foreground))] transition-colors">Why One4Team</a>
            <a href="#testimonials" className="hover:text-[hsl(var(--header-foreground))] transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-[hsl(var(--header-foreground))] transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="default">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="container mx-auto px-4 py-14 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                Run your sports club <span className="gold-gradient-text">Smarter</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                Memberships. Payments. Communication. One platform.
                <span className="block">Built for clubs of any size.</span>
              </p>
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
            <div className="w-full">
              <div className="relative">
                <AspectRatio ratio={16 / 10} className="overflow-hidden rounded-xl shadow-md relative">
                  <img
                    src="/lovable-uploads/f7fa8228-e4e5-4d57-9ef5-8a3452f44a83.png"
                    alt="One4Team sports club management hero - community at play"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${slide === 0 ? 'opacity-100' : 'opacity-0'}`}
                    loading="eager"
                    decoding="async"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                  <img
                    src="/lovable-uploads/e754b695-0c4d-4d3c-9144-a0bd29d4c8e0.png"
                    alt="One4Team logo over sports field at sunset"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${slide === 1 ? 'opacity-100' : 'opacity-0'}`}
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" aria-hidden />
                  <div ref={progressRef} className="absolute bottom-0 left-0 h-1 gold-gradient-bg" />
                </AspectRatio>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container mx-auto px-4 py-16">
          <h2 className="text-center text-3xl md:text-4xl font-bold">Everything your club needs in <span className="gold-gradient-text">one place</span></h2>
          <p className="mt-2 text-center text-muted-foreground max-w-2xl mx-auto">From member management to financial tracking, One4Team provides all the tools you need to run your club efficiently.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                  <CardTitle className="gold-gradient-text">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Why choose */}
        <section id="why" className="bg-muted/40">
          <div className="container mx-auto px-4 py-16 grid gap-10 md:grid-cols-2 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Why choose <BrandName />?</h2>
              <p className="mt-2 text-muted-foreground">Built specifically for sports clubs, by people who understand the unique challenges of club management.</p>
              <ul className="mt-6 space-y-4">
                {[
                  { title: 'Centralized club administration', desc: 'All your club operations in one unified platform', Icon: Zap },
                  { title: 'Easy for everyone', desc: 'Intuitive interface that anyone can use without training', Icon: Smartphone },
                  { title: 'GDPR-compliant and secure', desc: 'Bank‑level security with full compliance guarantee', Icon: Shield },
                  { title: 'Works on all devices', desc: 'Perfect experience on desktop, tablet and mobile', Icon: CheckCircle2 },
                ].map(({ title, desc, Icon }) => (
                  <li key={title} className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="text-muted-foreground text-sm">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4">
              {[
                { title: 'Number of Members', value: '87%' },
                { title: 'Matches Planned vs. Played', value: '92%' },
                { title: 'Number of Tickets Sold', value: '78%' },
                { title: 'Items in Shop', value: '65%' },
              ].map((m) => (
                <Card key={m.title} className="bg-card/80">
                  <CardHeader>
                    <CardTitle className="text-base">{m.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{m.value}</div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full gold-gradient-bg" style={{ width: m.value }} aria-hidden />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{m.value} complete</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="container mx-auto px-4 py-16">
          <h2 className="text-center text-3xl md:text-4xl font-bold">Trusted by clubs <span className="gold-gradient-text">everywhere</span></h2>
          <p className="mt-2 text-center text-muted-foreground max-w-2xl mx-auto">See what club managers are saying about One4Team.</p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Testimonial 1 */}
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex gold-gradient-text" aria-label="5 star rating">{'★★★★★'}</div>
                <blockquote className="mt-3 text-sm text-muted-foreground italic">
                  "One4Team has revolutionized the way we manage our club. Everything is now in one place – memberships, payments, communication. It's a real game‑changer!"
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
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">Join 500+ clubs that already use <BrandName /></p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              {[
                'TSV Allach 09',
                'FC Grün-Weiss Gröbenzell',
                'FC Augsburg',
                '1860 München',
              ].map((name) => (
                <div key={name} className="rounded-lg bg-muted/30 px-4 py-3 shadow-sm">
                  <span className="text-sm text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="pricing" className="py-16 bg-primary/15">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to transform your sports club?</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Join clubs already using One4Team to streamline operations and grow their membership.</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link to="/dashboard"><Button size="lg">Start Free Trial</Button></Link>
              <a href="#features"><Button size="lg" variant="outline">Contact Sales</Button></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-[hsl(var(--header))] text-[hsl(var(--header-foreground))]">
          <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 md:grid-rows-[auto_auto_auto_auto] items-start">
            {/* Row 4: Logo + Tagline aligned with last menu items */}
            <div className="md:col-start-1 md:row-start-4">
              <div className="flex items-center gap-3">
                <img src="/lovable-uploads/708afae6-09f9-40e1-b977-18f42b832348.png" alt="One4Team logo" className="h-28 md:h-36 w-auto" loading="lazy" />
                <p className="text-sm text-muted-foreground whitespace-nowrap">One Platform. For your Team.</p>
              </div>
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
