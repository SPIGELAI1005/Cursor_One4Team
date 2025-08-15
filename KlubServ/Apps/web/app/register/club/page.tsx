"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Shield,
  Zap,
  AlertCircle
} from "lucide-react";
import { 
  validateStep, 
  validateCompleteForm, 
  getFieldError, 
  hasFieldError,
  type ClubRegistrationFormData 
} from "@/lib/validation/club-registration";
import { z } from "zod";
import { useToast } from "@/components/ui/toast";

interface ClubFormData extends ClubRegistrationFormData {}

const sports = [
  "Football/Soccer", "Basketball", "Tennis", "Swimming", "Athletics", 
  "Volleyball", "Handball", "Hockey", "Rugby", "Cricket", "Baseball",
  "Golf", "Badminton", "Table Tennis", "Boxing", "Martial Arts",
  "Gymnastics", "Cycling", "Rowing", "Sailing", "Other"
];

const ageGroups = [
  "Under 6", "6-8 years", "9-11 years", "12-14 years", "15-17 years",
  "18-21 years", "22-35 years", "36-50 years", "Over 50", "Mixed Ages"
];

const facilities = [
  "Indoor Courts", "Outdoor Fields", "Swimming Pool", "Gym/Fitness Center",
  "Tennis Courts", "Athletics Track", "Sports Hall", "Training Rooms",
  "Equipment Storage", "Parking", "Cafeteria", "Medical Room"
];

export default function ClubRegistrationPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<z.ZodError | null>(null);
  const [formData, setFormData] = useState<ClubFormData>({
    clubName: "",
    sport: "",
    foundedYear: "",
    description: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    memberCount: "",
    ageGroups: [],
    facilities: [],
    achievements: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    marketingEmails: false
  });

  const updateFormData = (field: keyof ClubFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors) {
      setErrors(null);
    }
  };

  const validateCurrentStep = () => {
    const stepData = getStepData(currentStep);
    const result = validateStep(currentStep, stepData);
    
    if (!result.success) {
      setErrors(result.error);
      return false;
    }
    
    setErrors(null);
    return true;
  };

  const getStepData = (step: number) => {
    switch (step) {
      case 1:
        return {
          clubName: formData.clubName,
          sport: formData.sport,
          foundedYear: formData.foundedYear,
          description: formData.description,
        };
      case 2:
        return {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
        };
      case 3:
        return {
          memberCount: formData.memberCount,
          ageGroups: formData.ageGroups,
          facilities: formData.facilities,
          achievements: formData.achievements,
        };
      case 4:
        return {
          adminName: formData.adminName,
          adminEmail: formData.adminEmail,
          adminPhone: formData.adminPhone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          termsAccepted: formData.termsAccepted,
          marketingEmails: formData.marketingEmails,
        };
      default:
        return {};
    }
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate complete form
    const result = validateCompleteForm(formData);
    if (!result.success) {
      setErrors(result.error);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send data to backend API
      const response = await fetch('/api/public/register/club', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Registration successful
      console.log("Club registration successful:", data);
      
      // Redirect to success page
      router.push("/register/success");
    } catch (error) {
      console.error("Registration failed:", error);
      setIsSubmitting(false);
      
      // Show error message to user
      addToast({
        type: 'error',
        title: 'Registration Failed',
        message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      });
    }
  };

  const renderError = (fieldName: string) => {
    if (!errors) return null;
    const error = getFieldError(errors, fieldName);
    if (!error) return null;
    
    return (
      <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    );
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            step <= currentStep 
              ? "bg-blue-600 border-blue-600 text-white" 
              : "border-gray-300 text-gray-500"
          }`}>
            {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < 4 && (
            <div className={`w-16 h-0.5 mx-2 ${
              step < currentStep ? "bg-blue-600" : "bg-gray-300"
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="clubName">Club Name *</Label>
        <Input
          id="clubName"
          value={formData.clubName}
          onChange={(e) => updateFormData("clubName", e.target.value)}
          placeholder="Enter your club's name"
          required
          className={hasFieldError(errors!, "clubName") ? "border-red-500" : ""}
        />
        {renderError("clubName")}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sport">Primary Sport *</Label>
          <Select value={formData.sport} onValueChange={(value) => updateFormData("sport", value)}>
            <SelectTrigger className={hasFieldError(errors!, "sport") ? "border-red-500" : ""}>
              <SelectValue placeholder="Select your sport" />
            </SelectTrigger>
            <SelectContent>
              {sports.map((sport) => (
                <SelectItem key={sport} value={sport}>{sport}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {renderError("sport")}
        </div>
        
        <div>
          <Label htmlFor="foundedYear">Founded Year</Label>
          <Input
            id="foundedYear"
            type="number"
            value={formData.foundedYear}
            onChange={(e) => updateFormData("foundedYear", e.target.value)}
            placeholder="e.g., 1995"
            min="1800"
            max={new Date().getFullYear()}
            className={hasFieldError(errors!, "foundedYear") ? "border-red-500" : ""}
          />
          {renderError("foundedYear")}
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Club Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData("description", e.target.value)}
          placeholder="Tell us about your club, its mission, and what makes it special..."
          rows={4}
          className={hasFieldError(errors!, "description") ? "border-red-500" : ""}
        />
        {renderError("description")}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="address">Street Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => updateFormData("address", e.target.value)}
          placeholder="Enter street address"
          className={hasFieldError(errors!, "address") ? "border-red-500" : ""}
        />
        {renderError("address")}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => updateFormData("city", e.target.value)}
            placeholder="City"
            required
            className={hasFieldError(errors!, "city") ? "border-red-500" : ""}
          />
          {renderError("city")}
        </div>
        
        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => updateFormData("postalCode", e.target.value)}
            placeholder="Postal code"
            className={hasFieldError(errors!, "postalCode") ? "border-red-500" : ""}
          />
          {renderError("postalCode")}
        </div>
        
        <div>
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => updateFormData("country", e.target.value)}
            placeholder="Country"
            required
            className={hasFieldError(errors!, "country") ? "border-red-500" : ""}
          />
          {renderError("country")}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
            className={hasFieldError(errors!, "phone") ? "border-red-500" : ""}
          />
          {renderError("phone")}
        </div>
        
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            placeholder="club@example.com"
            required
            className={hasFieldError(errors!, "email") ? "border-red-500" : ""}
          />
          {renderError("email")}
        </div>
      </div>
      
      <div>
        <Label htmlFor="website">Website (Optional)</Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => updateFormData("website", e.target.value)}
          placeholder="https://www.yourclub.com"
          className={hasFieldError(errors!, "website") ? "border-red-500" : ""}
        />
        {renderError("website")}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="memberCount">Approximate Number of Members</Label>
        <Select value={formData.memberCount} onValueChange={(value) => updateFormData("memberCount", value)}>
          <SelectTrigger className={hasFieldError(errors!, "memberCount") ? "border-red-500" : ""}>
            <SelectValue placeholder="Select member count" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-50">1-50 members</SelectItem>
            <SelectItem value="51-100">51-100 members</SelectItem>
            <SelectItem value="101-250">101-250 members</SelectItem>
            <SelectItem value="251-500">251-500 members</SelectItem>
            <SelectItem value="501-1000">501-1000 members</SelectItem>
            <SelectItem value="1000+">1000+ members</SelectItem>
          </SelectContent>
        </Select>
        {renderError("memberCount")}
      </div>
      
      <div>
        <Label>Age Groups You Serve</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {ageGroups.map((group) => (
            <div key={group} className="flex items-center space-x-2">
              <Checkbox
                id={group}
                checked={formData.ageGroups.includes(group)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFormData("ageGroups", [...formData.ageGroups, group]);
                  } else {
                    updateFormData("ageGroups", formData.ageGroups.filter(g => g !== group));
                  }
                }}
              />
              <Label htmlFor={group} className="text-sm">{group}</Label>
            </div>
          ))}
        </div>
        {renderError("ageGroups")}
      </div>
      
      <div>
        <Label>Available Facilities</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {facilities.map((facility) => (
            <div key={facility} className="flex items-center space-x-2">
              <Checkbox
                id={facility}
                checked={formData.facilities.includes(facility)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFormData("facilities", [...formData.facilities, facility]);
                  } else {
                    updateFormData("facilities", formData.facilities.filter(f => f !== facility));
                  }
                }}
              />
              <Label htmlFor={facility} className="text-sm">{facility}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label htmlFor="achievements">Notable Achievements</Label>
        <Textarea
          id="achievements"
          value={formData.achievements}
          onChange={(e) => updateFormData("achievements", e.target.value)}
          placeholder="Any championships, awards, or notable achievements your club has won..."
          rows={3}
          className={hasFieldError(errors!, "achievements") ? "border-red-500" : ""}
        />
        {renderError("achievements")}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="adminName">Admin Name *</Label>
          <Input
            id="adminName"
            value={formData.adminName}
            onChange={(e) => updateFormData("adminName", e.target.value)}
            placeholder="Full name"
            required
            className={hasFieldError(errors!, "adminName") ? "border-red-500" : ""}
          />
          {renderError("adminName")}
        </div>
        
        <div>
          <Label htmlFor="adminEmail">Admin Email *</Label>
          <Input
            id="adminEmail"
            type="email"
            value={formData.adminEmail}
            onChange={(e) => updateFormData("adminEmail", e.target.value)}
            placeholder="admin@yourclub.com"
            required
            className={hasFieldError(errors!, "adminEmail") ? "border-red-500" : ""}
          />
          {renderError("adminEmail")}
        </div>
      </div>
      
      <div>
        <Label htmlFor="adminPhone">Admin Phone</Label>
        <Input
          id="adminPhone"
          type="tel"
          value={formData.adminPhone}
          onChange={(e) => updateFormData("adminPhone", e.target.value)}
          placeholder="+1 (555) 123-4567"
          className={hasFieldError(errors!, "adminPhone") ? "border-red-500" : ""}
        />
        {renderError("adminPhone")}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            placeholder="Create a strong password"
            required
            className={hasFieldError(errors!, "password") ? "border-red-500" : ""}
          />
          {renderError("password")}
        </div>
        
        <div>
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData("confirmPassword", e.target.value)}
            placeholder="Confirm your password"
            required
            className={hasFieldError(errors!, "confirmPassword") ? "border-red-500" : ""}
          />
          {renderError("confirmPassword")}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) => updateFormData("termsAccepted", checked)}
            required
          />
          <Label htmlFor="terms" className="text-sm">
            I agree to the{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            *
          </Label>
        </div>
        {renderError("termsAccepted")}
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="marketing"
            checked={formData.marketingEmails}
            onCheckedChange={(checked) => updateFormData("marketingEmails", checked)}
          />
          <Label htmlFor="marketing" className="text-sm">
            Send me updates about new features and club management tips
          </Label>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Basic Information";
      case 2:
        return "Contact Information";
      case 3:
        return "Club Details";
      case 4:
        return "Account Setup";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Register Your Sports Club
          </h1>
          <p className="text-lg text-gray-600">
            Join thousands of sports clubs using One4Team to manage members, schedules, payments, and more.
          </p>
        </div>

        {/* Progress Indicator */}
        {renderStepIndicator()}

        {/* Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mr-3">
                Step {currentStep} of 4
              </span>
              {getStepTitle()}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about your club"}
              {currentStep === 2 && "How can we reach you?"}
              {currentStep === 3 && "Help us understand your club better"}
              {currentStep === 4 && "Create your admin account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderCurrentStep()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.termsAccepted}
                    className="flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Create Club Account
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Quick Setup</h3>
              <p className="text-sm text-gray-600">
                Get your club online in minutes with our streamlined onboarding process
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Secure & Compliant</h3>
              <p className="text-sm text-gray-600">
                GDPR compliant with enterprise-grade security for your club's data
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Member Management</h3>
              <p className="text-sm text-gray-600">
                Manage members, payments, schedules, and communication all in one place
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            Already have an account?{" "}
            <a href="/sign-in" className="text-blue-600 hover:underline">
              Sign in here
            </a>
          </p>
          <p className="mt-2">
            Need help?{" "}
            <a href="/support" className="text-blue-600 hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 