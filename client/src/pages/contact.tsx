import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, MessageSquare, HelpCircle, Truck } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    inquiryType: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      organization: "",
      inquiryType: "",
      message: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">Get In Touch</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about our products or need help with your order? 
              We're here to help you create the perfect custom apparel.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Contact Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-black mt-0.5" />
                    <div>
                      <div className="font-medium text-black">Phone</div>
                      <div className="text-gray-600">+1 (555) 123-4567</div>
                      <div className="text-sm text-gray-500">Mon-Fri 9AM-6PM EST</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-black mt-0.5" />
                    <div>
                      <div className="font-medium text-black">Email</div>
                      <div className="text-gray-600">orders@strongwillsports.com</div>
                      <div className="text-sm text-gray-500">We respond within 24 hours</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-black mt-0.5" />
                    <div>
                      <div className="font-medium text-black">Address</div>
                      <div className="text-gray-600">
                        123 Athletic Way<br />
                        Sports City, SC 12345<br />
                        United States
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-black mt-0.5" />
                    <div>
                      <div className="font-medium text-black">Business Hours</div>
                      <div className="text-gray-600">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 4:00 PM<br />
                        Sunday: Closed
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="mr-2 h-5 w-5" />
                    Quick Help
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium text-black mb-1">Size Guide</div>
                    <p className="text-gray-600">Find the perfect fit for all our products</p>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium text-black mb-1">Design Help</div>
                    <p className="text-gray-600">Tips and tricks for using our design tool</p>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium text-black mb-1">Order Status</div>
                    <p className="text-gray-600">Track your order and delivery updates</p>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium text-black mb-1">Return Policy</div>
                    <p className="text-gray-600">Easy returns and exchanges within 30 days</p>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    Shipping & Delivery
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium text-black mb-1">Standard Shipping</div>
                    <p className="text-gray-600">5-7 business days - Free on orders over $100</p>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium text-black mb-1">Express Shipping</div>
                    <p className="text-gray-600">2-3 business days - $15.99</p>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium text-black mb-1">Rush Orders</div>
                    <p className="text-gray-600">Custom timeline available - Contact us for pricing</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Smith"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  {/* Organization */}
                  <div>
                    <Label htmlFor="organization">Organization/Team (Optional)</Label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) => handleInputChange("organization", e.target.value)}
                      placeholder="Eagle Wrestling Club"
                    />
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <Label htmlFor="inquiryType">Type of Inquiry *</Label>
                    <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Question</SelectItem>
                        <SelectItem value="product">Product Information</SelectItem>
                        <SelectItem value="design">Design Help</SelectItem>
                        <SelectItem value="group-order">Group Order Inquiry</SelectItem>
                        <SelectItem value="order-status">Order Status</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="wholesale">Wholesale/Partnership</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full btn-primary">
                    Send Message
                  </Button>

                  {/* Privacy Notice */}
                  <p className="text-xs text-gray-500">
                    By submitting this form, you agree to our privacy policy. We'll only use your 
                    information to respond to your inquiry and provide relevant product updates.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support Options */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-black text-center mb-8">Other Ways to Get Support</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-black mb-2">Live Chat</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get instant help from our support team during business hours.
                </p>
                <Button variant="outline" className="btn-secondary">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-black mb-2">Knowledge Base</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Browse our comprehensive FAQ and help articles.
                </p>
                <Button variant="outline" className="btn-secondary">
                  Browse FAQ
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-black mb-2">Phone Support</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Speak directly with our experts for complex inquiries.
                </p>
                <Button variant="outline" className="btn-secondary">
                  Call Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
