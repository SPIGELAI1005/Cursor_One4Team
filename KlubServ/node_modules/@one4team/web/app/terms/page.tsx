import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, CreditCard, Globe } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
            <CardDescription>
              By accessing and using One4Team, you accept and agree to be bound by the terms and provision of this agreement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700">
              These Terms of Service ("Terms") govern your use of the One4Team platform and services. 
              By using our service, you agree to these terms. If you don't agree to any part of these terms, 
              you may not use our service.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>2. Description of Service</CardTitle>
            <CardDescription>
              One4Team is a comprehensive sports club management platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              One4Team provides sports clubs with tools for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Member management and registration</li>
              <li>Event scheduling and calendar management</li>
              <li>Payment processing and invoicing</li>
              <li>Team communication and messaging</li>
              <li>Online shop and merchandise sales</li>
              <li>Custom club website creation</li>
              <li>Analytics and reporting</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>3. User Accounts and Responsibilities</CardTitle>
            <CardDescription>
              Your responsibilities when using One4Team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Account Creation</h4>
              <p className="text-gray-700">
                You must provide accurate, current, and complete information when creating an account. 
                You are responsible for maintaining the security of your account credentials.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Acceptable Use</h4>
              <p className="text-gray-700">
                You agree to use One4Team only for lawful purposes and in accordance with these Terms. 
                You may not use the service to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the service</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>4. Data Protection and Privacy</CardTitle>
            <CardDescription>
              How we handle your data and protect your privacy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              We are committed to protecting your privacy and personal data. Our data collection and 
              processing practices are described in detail in our Privacy Policy.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">GDPR Compliance</h4>
              <p className="text-blue-800 text-sm">
                One4Team is fully compliant with the General Data Protection Regulation (GDPR). 
                You have the right to access, rectify, and delete your personal data.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>5. Payment Terms</CardTitle>
            <CardDescription>
              Subscription fees and payment processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Subscription Fees</h4>
              <p className="text-gray-700">
                One4Team offers various subscription plans. Fees are billed in advance on a monthly 
                or annual basis, depending on your chosen plan.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Payment Processing</h4>
              <p className="text-gray-700">
                All payments are processed securely through our payment partners. We do not store 
                your payment card information on our servers.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Refunds</h4>
              <p className="text-gray-700">
                We offer a 30-day money-back guarantee for new subscriptions. Refund requests 
                must be submitted within 30 days of your initial purchase.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>6. Intellectual Property</CardTitle>
            <CardDescription>
              Ownership of content and intellectual property rights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Our Rights</h4>
              <p className="text-gray-700">
                One4Team and its original content, features, and functionality are owned by us and 
                are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Your Content</h4>
              <p className="text-gray-700">
                You retain ownership of any content you upload to One4Team. By uploading content, 
                you grant us a license to use, store, and display that content as necessary to provide our service.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>7. Limitation of Liability</CardTitle>
            <CardDescription>
              Our liability limitations and disclaimers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              To the maximum extent permitted by law, One4Team shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including without limitation, 
              loss of profits, data, use, goodwill, or other intangible losses.
            </p>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">Service Availability</h4>
              <p className="text-yellow-800 text-sm">
                While we strive to maintain high availability, we do not guarantee that the service 
                will be uninterrupted or error-free. We may temporarily suspend the service for maintenance.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>8. Termination</CardTitle>
            <CardDescription>
              How accounts can be terminated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">By You</h4>
              <p className="text-gray-700">
                You may terminate your account at any time by contacting our support team or 
                through your account settings.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">By Us</h4>
              <p className="text-gray-700">
                We may terminate or suspend your account immediately, without prior notice, 
                for conduct that we believe violates these Terms or is harmful to other users, 
                us, or third parties.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>9. Changes to Terms</CardTitle>
            <CardDescription>
              How we notify you of changes to these terms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. We will notify users of 
              any material changes via email or through the service. Your continued use of 
              One4Team after such modifications constitutes acceptance of the updated Terms.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>10. Contact Information</CardTitle>
            <CardDescription>
              How to reach us with questions about these terms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Email</h4>
                <a href="mailto:legal@one4team.com" className="text-blue-600 hover:underline">
                  legal@one4team.com
                </a>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Support</h4>
                <a href="/support" className="text-blue-600 hover:underline">
                  Contact Support
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            These terms are effective as of the date shown above and apply to all users of One4Team.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
            <a href="/support" className="text-blue-600 hover:underline">Support</a>
            <a href="/contact" className="text-blue-600 hover:underline">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
} 