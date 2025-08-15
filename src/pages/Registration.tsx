import { useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Stepper } from "@/components/ui/stepper"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useI18n } from "@/i18n/I18nProvider"
import BrandName from "@/components/BrandName"
import ThemeToggle from "@/components/ThemeToggle"
import LanguageToggle from "@/components/LanguageToggle"
import { ClubInfoStep } from "@/components/registration/ClubInfoStep"
import { AdminInfoStep } from "@/components/registration/AdminInfoStep"
import { ConfirmationStep } from "@/components/registration/ConfirmationStep"

export interface RegistrationData {
  clubName: string
  clubType: string
  country: string
  clubWebsite: string
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export default function Registration() {
  const { t } = useI18n()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<RegistrationData>({
    clubName: "",
    clubType: "",
    country: "",
    clubWebsite: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })

  const steps = [
    "Club Information",
    "Admin Account",
    "Confirmation"
  ]

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(formData.clubName && formData.clubType && formData.country)
      case 1:
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          formData.acceptTerms
        )
      case 2:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Handle final form submission
    console.log("Form submitted:", formData)
    // Redirect to dashboard or success page
  }

  const updateFormData = (data: Partial<RegistrationData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ClubInfoStep
            data={formData}
            updateData={updateFormData}
          />
        )
      case 1:
        return (
          <AdminInfoStep
            data={formData}
            updateData={updateFormData}
          />
        )
      case 2:
        return (
          <ConfirmationStep
            data={formData}
            updateData={updateFormData}
            onEdit={setCurrentStep}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <Helmet>
        <title>Join One4Team – Sports Club Registration</title>
        <meta name="description" content="Register your sports club with One4Team. Manage members, payments, and communications all in one platform." />
        <meta name="keywords" content="sports club registration, club management, team management, member management" />
        <link rel="canonical" href={window.location.origin + "/register"} />
      </Helmet>

      <div className="min-h-screen bg-background">
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
        <main className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Join <BrandName className="gold-gradient-text" />
              </h1>
              <p className="text-muted-foreground">
                Set up your sports club in just a few simple steps
              </p>
            </div>

            {/* Stepper */}
            <div className="mb-8">
              <Stepper steps={steps} currentStep={currentStep} />
            </div>

            {/* Form Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">
                  {steps[currentStep]}
                </CardTitle>
                <CardDescription>
                  {currentStep === 0 && "Tell us about your sports club"}
                  {currentStep === 1 && "Create your administrator account"}
                  {currentStep === 2 && "Review and confirm your information"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderStepContent()}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <div>
                    {currentStep > 0 ? (
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                      </Button>
                    ) : (
                      <Link to="/">
                        <Button variant="ghost" className="flex items-center gap-2">
                          <ArrowLeft className="h-4 w-4" />
                          Back to Home
                        </Button>
                      </Link>
                    )}
                  </div>
                  
                  <div>
                    {currentStep < steps.length - 1 ? (
                      <Button
                        onClick={handleNext}
                        disabled={!isStepValid(currentStep)}
                        className="flex items-center gap-2"
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={!isStepValid(currentStep)}
                        className="gold-gradient-bg flex items-center gap-2"
                      >
                        Create Club Account
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}