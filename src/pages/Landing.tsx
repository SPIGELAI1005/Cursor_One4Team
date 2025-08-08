import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { CheckCircle2, Shield, Smartphone, Zap } from "lucide-react";

const Landing = () => {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'One4Team',
    url: window.location.origin,
    logo: window.location.origin + '/lovable-uploads/2bff6417-99e7-4070-a218-4250474d2d4c.png'
  };

  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!carouselApi) return;
    const id = setInterval(() => {
      carouselApi.scrollNext();
    }, 3000);
    return () => clearInterval(id);
  }, [carouselApi]);

  return (
    <>
      <Helmet>
        <title>One4Team – Sports Club Management Platform</title>
        <meta name="description" content="Run your sports club smarter with One4Team. Memberships, payments, schedules and communication in one platform." />
        <link rel="canonical" href={window.location.origin + "/"} />
        <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
      </Helmet>

      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img
              src="/lovable-uploads/2bff6417-99e7-4070-a218-4250474d2d4c.png"
              alt="One4Team logo"
              className="h-8 w-auto"
              loading="lazy"
            />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground" aria-label="Primary">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#why" className="hover:text-foreground transition-colors">Why One4Team</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
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
                Run your sports club <span className="text-primary">Smarter</span>
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
              <Carousel opts={{ loop: true }} setApi={setCarouselApi} className="w-full">
                <CarouselContent>
                  <CarouselItem>
                    <AspectRatio ratio={16 / 10} className="overflow-hidden rounded-xl shadow-md">
                      <img
                        src="/lovable-uploads/f7fa8228-e4e5-4d57-9ef5-8a3452f44a83.png"
                        alt="One4Team sports club management hero - community at play"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </AspectRatio>
                  </CarouselItem>
                  <CarouselItem>
                    <AspectRatio ratio={16 / 10} className="overflow-hidden rounded-xl shadow-md">
                      <img
                        src="/lovable-uploads/e754b695-0c4d-4d3c-9144-a0bd29d4c8e0.png"
                        alt="One4Team logo over sports field at sunset"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </AspectRatio>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container mx-auto px-4 py-16">
          <h2 className="text-center text-3xl md:text-4xl font-bold">Everything your club needs in <span className="text-primary">one place</span></h2>
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
                  <CardTitle>{f.title}</CardTitle>
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
              <h2 className="text-3xl md:text-4xl font-bold">Why choose <span className="text-primary">One4Team</span>?</h2>
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
                      <div className="h-2 rounded-full bg-primary" style={{ width: m.value }} aria-hidden />
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
          <h2 className="text-center text-3xl md:text-4xl font-bold">Trusted by clubs <span className="text-primary">everywhere</span></h2>
          <p className="mt-2 text-center text-muted-foreground max-w-2xl mx-auto">See what club managers are saying about One4Team.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[1,2,3].map((i) => (
              <Card key={i} className="bg-muted/30">
                <CardContent className="pt-6">
                  <div className="flex text-primary">{'★★★★★'}</div>
                  <p className="mt-3 text-sm text-muted-foreground">“One4Team has revolutionized the way we manage our club. Everything is in one place – memberships, payments, communication.”</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Avatar className="h-9 w-9"><AvatarFallback>O4T</AvatarFallback></Avatar>
                    <div>
                      <p className="text-sm font-medium">Club Manager</p>
                      <p className="text-xs text-muted-foreground">Successful Sports Club</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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

      <footer className="border-t">
        <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <img src="/lovable-uploads/2bff6417-99e7-4070-a218-4250474d2d4c.png" alt="One4Team logo" className="h-8 w-auto" loading="lazy" />
              <span className="font-semibold">One4Team</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">The smart platform for sports clubs. Manage your club efficiently with our comprehensive tools.</p>
          </div>
          <div>
            <h3 className="font-semibold">Product</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
              <li><Link to="/dashboard" className="hover:text-foreground">Get Started</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">About</a></li>
              <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground">Legal Notice</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t py-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} One4Team. All rights reserved.</div>
      </footer>
    </>
  );
};

export default Landing;
