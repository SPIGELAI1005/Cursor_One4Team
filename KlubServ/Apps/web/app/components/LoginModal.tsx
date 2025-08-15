"use client";

import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { X, ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = "login" | "forgot-password" | "reset-sent";

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { t } = useLanguage();

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (!validateEmail(email)) {
        setErrors({ email: t.login.invalidEmail });
        return;
      }

      if (!validatePassword(password)) {
        setErrors({ password: t.login.passwordTooShort });
        return;
      }

      const result = await signIn?.create({
        identifier: email,
        password,
      });

      if (result?.status === "complete") {
        // Successfully signed in
        onClose();
        window.location.reload(); // Refresh to update auth state
      } else {
        setErrors({ general: t.login.invalidCredentials });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific Clerk error codes
      if (error.errors?.[0]?.code === "form_identifier_not_found") {
        setErrors({ email: t.login.accountNotFound });
      } else if (error.errors?.[0]?.code === "form_password_incorrect") {
        setErrors({ password: t.login.incorrectPassword });
      } else if (error.errors?.[0]?.code === "form_identifier_not_found") {
        setErrors({ email: t.login.accountNotFound });
      } else {
        setErrors({ general: t.login.generalError });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (!validateEmail(email)) {
        setErrors({ email: t.login.invalidEmail });
        return;
      }

      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setCurrentStep("reset-sent");
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setErrors({ general: t.login.resetEmailFailed });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (!validateEmail(email)) {
        setErrors({ email: t.login.invalidEmail });
        return;
      }

      if (!validatePassword(password)) {
        setErrors({ password: t.login.passwordTooShort });
        return;
      }

      const result = await signUp?.create({
        emailAddress: email,
        password,
      });

      if (result?.status === "complete") {
        // Successfully signed up
        onClose();
        window.location.reload(); // Refresh to update auth state
      } else {
        setErrors({ general: t.login.createAccountFailed });
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      if (error.errors?.[0]?.code === "form_identifier_exists") {
        setErrors({ email: t.login.accountExists });
      } else {
        setErrors({ general: t.login.createAccountFailed });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">{t.login.welcomeBack}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
                         <CardDescription>
          {t.login.signInDescription.split('One4Team')[0]}<span className="text-blue-600">One4Team</span>{t.login.signInDescription.split('One4Team')[1]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" required>
              {t.login.email}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                             <Input
                 id="email"
                 type="email"
                 placeholder={t.login.emailPlaceholder}
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="pl-10"
                 hasError={!!errors.email}
                 required
               />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" required>
              {t.login.password}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                             <Input
                 id="password"
                 type={showPassword ? "text" : "password"}
                 placeholder={t.login.passwordPlaceholder}
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="pl-10 pr-10"
                 hasError={!!errors.password}
                 required
               />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {errors.general && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{errors.general}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={!signInLoaded}
          >
            {t.login.signIn}
          </Button>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setCurrentStep("forgot-password")}
            >
              {t.login.forgotPassword}
            </Button>

                         <div className="relative">
               <div className="absolute inset-0 flex items-center">
                 <span className="w-full border-t" />
               </div>
               <div className="relative flex justify-center text-xs uppercase">
                 <span className="bg-background px-2 text-muted-foreground">
                   {t.login.or}
                 </span>
               </div>
             </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleCreateAccount}
              disabled={!signUpLoaded || isLoading}
            >
              {t.login.signUp}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderForgotPasswordStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentStep("login")}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
                     <CardTitle className="text-2xl font-bold">{t.login.resetPassword}</CardTitle>
         </div>
         <CardDescription>
           {t.login.resetPasswordDescription}
         </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="space-y-2">
                         <Label htmlFor="reset-email" required>
               {t.login.email}
             </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                             <Input
                 id="reset-email"
                 type="email"
                 placeholder={t.login.emailPlaceholder}
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="pl-10"
                 hasError={!!errors.email}
                 required
               />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {errors.general && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{errors.general}</p>
            </div>
          )}

                     <Button
             type="submit"
             className="w-full"
             isLoading={isLoading}
           >
             {t.login.sendResetLink}
           </Button>

           <Button
             type="button"
             variant="ghost"
             className="w-full"
             onClick={() => setCurrentStep("login")}
           >
             {t.login.backToSignIn}
           </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderResetSentStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
                 <CardTitle className="text-2xl font-bold">{t.login.checkYourEmail}</CardTitle>
         <CardDescription>
           {t.login.resetEmailSent} <strong>{email}</strong>
         </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
                 <div className="text-center text-sm text-muted-foreground">
           <p>{t.login.didntReceiveEmail}</p>
           <Button
             variant="link"
             className="p-0 h-auto"
             onClick={() => setCurrentStep("forgot-password")}
           >
             {t.login.tryAgainDifferentEmail}
           </Button>
         </div>

         <Button
           type="button"
           variant="outline"
           className="w-full"
           onClick={() => setCurrentStep("login")}
         >
           {t.login.backToSignIn}
         </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md">
        {currentStep === "login" && renderLoginStep()}
        {currentStep === "forgot-password" && renderForgotPasswordStep()}
        {currentStep === "reset-sent" && renderResetSentStep()}
      </div>
    </div>
  );
} 