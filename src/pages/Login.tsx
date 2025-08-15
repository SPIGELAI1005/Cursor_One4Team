import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { SignIn, useAuth } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Smartphone } from "lucide-react"
import { useI18n } from "@/i18n/I18nProvider"
import BrandName from "@/components/BrandName"
import ThemeToggle from "@/components/ThemeToggle"
import LanguageToggle from "@/components/LanguageToggle"
import { useEffect } from "react"

export default function Login() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()
  const [loginMethod, setLoginMethod] = useState<"social" | "magic" | "email">("social")
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard')
    }
  }, [isSignedIn, navigate])

  const handleMagicLink = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setMagicLinkSent(true)
      setIsLoading(false)
    }, 1500)
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Handle email/password login here
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <>
      <Helmet>
        <title>Sign In – One4Team Sports Club Platform</title>
        <meta name="description" content="Sign in to your One4Team account to access your sports club management dashboard." />
        <meta name="keywords" content="sign in, login, sports club, team management, One4Team" />
        <link rel="canonical" href={window.location.origin + "/login"} />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/lovable-uploads/85fc7aa9-a7bc-4a2a-8e5e-6e60551ded1e.png"
                alt="One4Team logo"
                className="h-7 w-auto"
                loading="eager"
              />
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle size="icon" />
              <LanguageToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center py-8 px-4">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">
                Welcome back to <BrandName className="gold-gradient-text" />
              </h1>
              <p className="text-muted-foreground">
                Sign in to access your sports club dashboard
              </p>
            </div>

            <Card className="shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Sign in</CardTitle>
                <CardDescription>
                  Choose your preferred sign-in method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="social" className="text-xs">Social</TabsTrigger>
                    <TabsTrigger value="magic" className="text-xs">Magic Link</TabsTrigger>
                    <TabsTrigger value="email" className="text-xs">Email</TabsTrigger>
                  </TabsList>
                  
                  {/* Social Login */}
                  <TabsContent value="social" className="space-y-4">
                    <div className="space-y-3">
                      <SignIn
                        appearance={{
                          elements: {
                            rootBox: "w-full",
                            card: "shadow-none border-0 bg-transparent",
                            headerTitle: "hidden",
                            headerSubtitle: "hidden",
                            socialButtonsBlockButton: "w-full justify-center gap-2 h-10 bg-background border border-input hover:bg-accent hover:text-accent-foreground",
                            socialButtonsBlockButtonText: "text-sm",
                            formButtonPrimary: "w-full gold-gradient-bg text-foreground h-10",
                            footerAction: "hidden"
                          }
                        }}
                        fallbackRedirectUrl="/dashboard"
                        signUpUrl="/register"
                      />
                    </div>
                  </TabsContent>

                  {/* Magic Link */}
                  <TabsContent value="magic" className="space-y-4">
                    {!magicLinkSent ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="magic-email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" />
                            Email Address
                          </Label>
                          <Input
                            id="magic-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                          />
                        </div>
                        <Button
                          onClick={handleMagicLink}
                          disabled={!email || isLoading}
                          className="w-full flex items-center gap-2"
                        >
                          {isLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Smartphone className="h-4 w-4" />
                          )}
                          Send Magic Link
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center space-y-4 py-8">
                        <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                          <Mail className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Check your inbox!</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            We've sent a sign-in link to <strong>{email}</strong>
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setMagicLinkSent(false)}
                          className="text-sm"
                        >
                          Use a different email
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Email & Password */}
                  <TabsContent value="email" className="space-y-4">
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password" className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-primary" />
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="pr-10"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="remember"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked === true)}
                          />
                          <Label htmlFor="remember" className="text-sm">
                            Remember me
                          </Label>
                        </div>
                        <Link
                          to="/forgot-password"
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        disabled={!email || !password || isLoading}
                        className="w-full flex items-center gap-2"
                      >
                        {isLoading ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                        Sign In
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Navigation Links */}
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Sign up here
                </Link>
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                  <ArrowLeft className="h-3 w-3" />
                  Back to Home
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary">
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}