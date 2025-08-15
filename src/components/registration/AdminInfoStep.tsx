import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { User, Mail, Phone, Eye, EyeOff, Shield } from "lucide-react"
import type { RegistrationData } from "@/pages/Registration"

interface AdminInfoStepProps {
  data: RegistrationData
  updateData: (data: Partial<RegistrationData>) => void
}

export function AdminInfoStep({ data, updateData }: AdminInfoStepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/\d/.test(password)) strength += 25
    return strength
  }

  const passwordStrength = getPasswordStrength(data.password)
  const passwordsMatch = data.password === data.confirmPassword && data.confirmPassword.length > 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:gap-6">
        {/* Name Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              First Name *
            </Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => updateData({ firstName: e.target.value })}
              placeholder="Enter your first name"
              className="text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Last Name *
            </Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => updateData({ lastName: e.target.value })}
              placeholder="Enter your last name"
              className="text-base"
              required
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => updateData({ email: e.target.value })}
              placeholder="admin@yourclub.com"
              className="text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone Number (Optional)
            </Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => updateData({ phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              className="text-base"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Password *
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => updateData({ password: e.target.value })}
              placeholder="Create a secure password"
              className="text-base pr-10"
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
          {data.password && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Progress value={passwordStrength} className="flex-1 h-2" />
                <span className="text-xs text-muted-foreground">
                  {passwordStrength < 50 ? "Weak" : passwordStrength < 75 ? "Good" : "Strong"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Password should be at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Confirm Password *
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={data.confirmPassword}
              onChange={(e) => updateData({ confirmPassword: e.target.value })}
              placeholder="Confirm your password"
              className={`text-base pr-10 ${
                data.confirmPassword && !passwordsMatch ? "border-destructive" : ""
              }`}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          {data.confirmPassword && !passwordsMatch && (
            <p className="text-xs text-destructive">Passwords do not match</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={data.acceptTerms}
              onCheckedChange={(checked) => updateData({ acceptTerms: checked === true })}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms"
                className="text-sm font-normal leading-relaxed cursor-pointer"
              >
                I accept the{" "}
                <a href="/terms" className="text-primary hover:underline" target="_blank">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-primary hover:underline" target="_blank">
                  Privacy Policy
                </a>
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Your administrator account</h3>
        <p className="text-sm text-muted-foreground">
          This will be your main account to manage your club. You can add other administrators later.
        </p>
      </div>
    </div>
  )
}