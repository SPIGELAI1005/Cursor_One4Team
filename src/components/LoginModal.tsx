import { useState } from "react"
import { Link } from "react-router-dom"
import { SignIn } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Eye, EyeOff, Mail, Lock, Smartphone, X } from "lucide-react"
import BrandName from "@/components/BrandName"

interface LoginModalProps {
  children: React.ReactNode
}

export default function LoginModal({ children }: LoginModalProps) {
  const [open, setOpen] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"social" | "magic" | "email">("social")
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handleMagicLink = async () => {
    setIsLoading(true)
    setTimeout(() => {
      setMagicLinkSent(true)
      setIsLoading(false)
    }, 1500)
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setOpen(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Sign in to <BrandName className="gold-gradient-text" />
          </DialogTitle>
          <DialogDescription>
            Quick access to your sports club dashboard
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="social" className="text-xs">Social</TabsTrigger>
              <TabsTrigger value="magic" className="text-xs">Magic</TabsTrigger>
              <TabsTrigger value="email" className="text-xs">Email</TabsTrigger>
            </TabsList>
            
            {/* Social Login */}
            <TabsContent value="social" className="space-y-3">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-0 bg-transparent",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "w-full justify-center gap-2 h-9 bg-background border border-input hover:bg-accent hover:text-accent-foreground text-sm",
                    socialButtonsBlockButtonText: "text-sm",
                    formButtonPrimary: "w-full gold-gradient-bg text-foreground h-9",
                    footerAction: "hidden"
                  }
                }}
                fallbackRedirectUrl="/dashboard"
                signUpUrl="/register"
              />
            </TabsContent>

            {/* Magic Link */}
            <TabsContent value="magic" className="space-y-3">
              {!magicLinkSent ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="modal-magic-email" className="text-sm">Email Address</Label>
                    <Input
                      id="modal-magic-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="h-9"
                    />
                  </div>
                  <Button
                    onClick={handleMagicLink}
                    disabled={!email || isLoading}
                    size="sm"
                    className="w-full"
                  >
                    {isLoading ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Smartphone className="h-3 w-3 mr-2" />
                    )}
                    Send Magic Link
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-3 py-4">
                  <div className="h-12 w-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Check your inbox!</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Sign-in link sent to {email}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMagicLinkSent(false)}
                  >
                    Try different email
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Email & Password */}
            <TabsContent value="email" className="space-y-3">
              <form onSubmit={handleEmailLogin} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="modal-email" className="text-sm">Email</Label>
                  <Input
                    id="modal-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-9"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="modal-password" className="text-sm">Password</Label>
                  <div className="relative">
                    <Input
                      id="modal-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-9 pr-9"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-9 w-9 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <Eye className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                    onClick={() => setOpen(false)}
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={!email || !password || isLoading}
                  size="sm"
                  className="w-full"
                >
                  {isLoading ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-3 w-3 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="pt-3 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="text-primary hover:underline font-medium"
                onClick={() => setOpen(false)}
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}