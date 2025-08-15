import GuestHeader from "../components/guest/GuestHeader";
import GuestFooter from "../components/guest/GuestFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <GuestHeader />
      
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
            
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-600 mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  sign up for our services, or contact us for support. This may include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Name and contact information</li>
                  <li>Club and organization details</li>
                  <li>Payment information</li>
                  <li>Communication preferences</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Provide and maintain our services</li>
                  <li>Process payments and transactions</li>
                  <li>Send you important updates and notifications</li>
                  <li>Provide customer support</li>
                  <li>Improve our services and develop new features</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except as described in this policy. We may share your information with:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Service providers who assist us in operating our platform</li>
                  <li>Payment processors for secure payment processing</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                <p className="text-gray-600 mb-4">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. This includes encryption, 
                  secure servers, and regular security assessments.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
                <p className="text-gray-600 mb-4">
                  Under GDPR, you have the following rights regarding your personal data:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Right to access your personal data</li>
                  <li>Right to rectification of inaccurate data</li>
                  <li>Right to erasure ("right to be forgotten")</li>
                  <li>Right to restrict processing</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
                <p className="text-gray-600 mb-4">
                  We use cookies and similar technologies to enhance your experience on our platform. 
                  You can control cookie settings through your browser preferences.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <p className="text-gray-600 mb-4">
                  Email: privacy@one4team.com<br />
                  Address: One4Team GmbH, Musterstraße 123, 12345 Musterstadt, Deutschland
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
                <p className="text-gray-600 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Last Updated:</strong> January 1, 2024
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <GuestFooter />
    </div>
  );
} 