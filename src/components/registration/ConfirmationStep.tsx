import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, User, Mail, Phone, Globe, MapPin, Edit2 } from "lucide-react"
import type { RegistrationData } from "@/pages/Registration"

interface ConfirmationStepProps {
  data: RegistrationData
  updateData: (data: Partial<RegistrationData>) => void
  onEdit: (step: number) => void
}

export function ConfirmationStep({ data, onEdit }: ConfirmationStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h3 className="text-lg font-semibold mb-2">Almost there!</h3>
        <p className="text-muted-foreground">
          Please review your information before creating your club account
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Club Information */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Club Information
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(0)}
                className="h-8 px-2 text-xs"
              >
                <Edit2 className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">{data.clubName}</p>
              <p className="text-xs text-muted-foreground">Club Name</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {data.clubType}
              </Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {data.country}
              </div>
            </div>
            {data.clubWebsite && (
              <div>
                <div className="flex items-center gap-1 text-xs">
                  <Globe className="h-3 w-3 text-primary" />
                  <a 
                    href={data.clubWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {data.clubWebsite}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Administrator Information */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Administrator Account
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(1)}
                className="h-8 px-2 text-xs"
              >
                <Edit2 className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">
                {data.firstName} {data.lastName}
              </p>
              <p className="text-xs text-muted-foreground">Full Name</p>
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm">
                <Mail className="h-3 w-3 text-primary" />
                {data.email}
              </div>
              <p className="text-xs text-muted-foreground">Email Address</p>
            </div>
            {data.phone && (
              <div>
                <div className="flex items-center gap-1 text-sm">
                  <Phone className="h-3 w-3 text-primary" />
                  {data.phone}
                </div>
                <p className="text-xs text-muted-foreground">Phone Number</p>
              </div>
            )}
            <div className="pt-2">
              <Badge variant="outline" className="text-xs">
                Password Set ✓
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* What Happens Next */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">What happens next?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-medium">1.</span>
              Your club account will be created instantly
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-medium">2.</span>
              You'll be logged in and taken to your dashboard
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-medium">3.</span>
              You can start adding members and setting up your club
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-medium">4.</span>
              Your 14-day free trial begins immediately
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground">
        By creating your account, you confirm that the information provided is accurate and agree to our terms of service.
      </div>
    </div>
  )
}