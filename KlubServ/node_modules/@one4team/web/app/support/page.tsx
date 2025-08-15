import GuestHeader from "../components/guest/GuestHeader";
import GuestFooter from "../components/guest/GuestFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageSquare, BookOpen, Video, Users } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <GuestHeader />
      
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Support Center
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're here to help you get the most out of One4Team. Find answers to common questions, 
                get in touch with our support team, or explore our resources.
              </p>
            </div>

            {/* Quick Help Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>
                    Comprehensive guides and tutorials to help you get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="#">
                    <Button variant="outline" className="w-full">
                      Browse Docs
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Video className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Video Tutorials</CardTitle>
                  <CardDescription>
                    Step-by-step video guides for common tasks and features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="#">
                    <Button variant="outline" className="w-full">
                      Watch Videos
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle>Community</CardTitle>
                  <CardDescription>
                    Connect with other users and share best practices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="#">
                    <Button variant="outline" className="w-full">
                      Join Community
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                <p className="text-gray-600 mb-8">
                  Can't find what you're looking for? Our support team is here to help you 
                  with any questions or issues you might have.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                      <p className="text-gray-600 mb-2">
                        Get help via email. We typically respond within 24 hours.
                      </p>
                                        <a href="mailto:support@one4team.com" className="text-blue-600 hover:text-blue-700 font-medium">
                    support@one4team.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
                      <p className="text-gray-600 mb-2">
                        Speak directly with our support team during business hours.
                      </p>
                      <a href="tel:+49123456789" className="text-blue-600 hover:text-blue-700 font-medium">
                        +49 123 456 789
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                      <p className="text-gray-600 mb-2">
                        Chat with our support team in real-time during business hours.
                      </p>
                      <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                        Start Chat
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Hours</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Monday - Friday</span>
                      <span className="text-gray-600">9:00 AM - 6:00 PM CET</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Saturday</span>
                      <span className="text-gray-600">10:00 AM - 4:00 PM CET</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Sunday</span>
                      <span className="text-gray-600">Closed</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Emergency Support</h3>
                    <p className="text-gray-600 mb-3">
                      For critical issues outside business hours, please email us with "URGENT" in the subject line.
                    </p>
                                            <a href="mailto:emergency@one4team.com" className="text-red-600 hover:text-red-700 font-medium">
                          emergency@one4team.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How do I get started with One4Team?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Simply sign up for an account, add your club information, and start inviting members. 
                      Our setup wizard will guide you through the process step by step.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      We accept all major credit cards, PayPal, and bank transfers. 
                      All payments are processed securely through Stripe.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Can I import my existing member data?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Yes! We support CSV imports for member data, and our support team can help you 
                      migrate from other systems.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Is my data secure?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Absolutely. We use bank-level encryption and are fully GDPR compliant. 
                      Your data is stored securely in EU data centers.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <GuestFooter />
    </div>
  );
} 