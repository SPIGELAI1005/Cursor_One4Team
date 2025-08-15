import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function ExplainerVideo() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            How One4Team Works in 90 Seconds
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how easy it is to manage your sports club with our comprehensive platform.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20">
              {/* Video Thumbnail/Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <Play className="h-8 w-8 text-primary ml-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      One4Team Platform Overview
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Watch how clubs streamline their operations with member management, 
                      payments, scheduling, and communication tools.
                    </p>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={() => setIsVideoOpen(true)}
                    className="shadow-lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch Overview
                  </Button>
                </div>
              </div>

              {/* Floating Feature Previews */}
              <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 rounded-lg p-3 shadow-lg backdrop-blur-sm">
                <div className="text-xs font-semibold text-primary">Member Management</div>
                <div className="text-xs text-muted-foreground">500+ members organized</div>
              </div>

              <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 rounded-lg p-3 shadow-lg backdrop-blur-sm">
                <div className="text-xs font-semibold text-secondary">Automated Billing</div>
                <div className="text-xs text-muted-foreground">€50K+ processed monthly</div>
              </div>

              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 rounded-lg p-3 shadow-lg backdrop-blur-sm">
                <div className="text-xs font-semibold text-green-600">Communication</div>
                <div className="text-xs text-muted-foreground">Real-time notifications</div>
              </div>

              <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 rounded-lg p-3 shadow-lg backdrop-blur-sm">
                <div className="text-xs font-semibold text-orange-600">Scheduling</div>
                <div className="text-xs text-muted-foreground">Smart calendar sync</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold mb-2">Quick Setup</h3>
            <p className="text-sm text-muted-foreground">
              Get your club running in under 10 minutes with our guided setup wizard.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-semibold mb-2">All-in-One</h3>
            <p className="text-sm text-muted-foreground">
              Replace multiple tools with one comprehensive platform designed for sports clubs.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="font-semibold mb-2">Proven Results</h3>
            <p className="text-sm text-muted-foreground">
              Clubs save 10+ hours per week on administrative tasks and grow membership by 40%.
            </p>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl w-full p-0">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white space-y-4">
                <div className="text-6xl">🎥</div>
                <h3 className="text-xl font-semibold">Video Coming Soon</h3>
                <p className="text-white/80 max-w-md mx-auto">
                  We're creating an amazing overview video to show you exactly how One4Team transforms sports club management.
                </p>
                <Button variant="secondary" onClick={() => setIsVideoOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setIsVideoOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}