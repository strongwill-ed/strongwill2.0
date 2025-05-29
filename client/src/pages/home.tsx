import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { ProductCategory } from "@shared/schema";
import { useLocation } from "wouter";
import { ArrowRight, Check, Users, Palette, ShoppingBag } from "lucide-react";
import { NewsletterSubscription } from "@/components/newsletter/newsletter-subscription";
import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/use-translation";
import heroImage from "@assets/aussie football banner team jersey singlet shorts squad.jpg";
import year12LeaversImage from "@assets/YEAR-12-FINAL-5.jpg";
import sportsUniformsImage from "@assets/Sports-Uniforms.jpg";
import gymTrainingImage from "@assets/Gymwear-Training.jpg";

// Dynamic text rotation component
function DynamicText() {
  const { t } = useTranslation();
  const words = t('home.dynamicWords') as string[];
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsVisible(true);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span 
      className={`inline-block transition-all duration-300 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
      }`}
      style={{ minWidth: '280px', textAlign: 'center' }}
    >
      {words[currentWordIndex]}
    </span>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  
  const { data: categories, isLoading } = useQuery<ProductCategory[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <div className="bg-white">
      {/* Hero Section - Full Page Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage}
            alt="Mixed team playing Australian football"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/25"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
            {t('home.heroTitle')} <span className="italic font-black">Perfect</span><br />
            <DynamicText /> {t('home.apparel')}
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            {t('home.heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
              onClick={() => setLocation("/design-tool")}
            >
              Start Designing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black font-semibold px-8 py-4 text-lg transition-all duration-300"
              onClick={() => setLocation("/products")}
            >
              View Products
            </Button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Our Product Range</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional-grade athletic apparel designed for peak performance and customization.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Sports Uniforms and Gym & Training */}
            <div className="space-y-6">
              {/* Sports Uniforms */}
              <Card 
                className="card-hover cursor-pointer overflow-hidden"
                onClick={() => setLocation("/products?category=sports")}
              >
                <div className="aspect-[2/1] overflow-hidden">
                  <img 
                    src={sportsUniformsImage}
                    alt="Sports Uniforms" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-black mb-2">Sports Uniforms</h3>
                  <p className="text-gray-600">Professional sports uniforms for teams and clubs. Custom designs for rugby, netball, AFL, and all sporting codes.</p>
                </CardContent>
              </Card>

              {/* Gym & Training */}
              <Card 
                className="card-hover cursor-pointer overflow-hidden"
                onClick={() => setLocation("/products?category=gym")}
              >
                <div className="aspect-[2/1] overflow-hidden bg-gray-100">
                  <img 
                    src={gymTrainingImage}
                    alt="Gym & Training" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-black mb-2">Gym & Training</h3>
                  <p className="text-gray-600">High-performance training apparel for fitness enthusiasts. Breathable fabrics and ergonomic designs for optimal performance.</p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Year 12 Leavers */}
            <div>
              <Card 
                className="card-hover cursor-pointer overflow-hidden h-full"
                onClick={() => setLocation("/products?category=year12")}
              >
                <div className="aspect-[1/1.2] overflow-hidden">
                  <img 
                    src={year12LeaversImage}
                    alt="Year 12 Leavers" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-black mb-2">Year 12 Leavers</h3>
                  <p className="text-gray-600">Celebrate your graduation with custom Year 12 leavers apparel. Hoodies, jackets, and more to commemorate your achievement.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Design Tool Preview */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                Advanced Design Tool
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Create professional designs with our intuitive design interface. Add text, graphics, and customize colors with precision.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Real-time design preview",
                  "Custom text and graphics",
                  "Color customization",
                  "High-resolution export"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-black" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                size="lg" 
                className="btn-primary"
                onClick={() => setLocation("/design-tool")}
              >
                Try Design Tool
                <Palette className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Design Tool Interface Mockup */}
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
              <Card className="overflow-hidden">
                <div className="bg-black text-white p-4 flex items-center justify-between">
                  <span className="font-medium">Design Tool</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" className="text-white hover:text-gray-300 p-1">
                      <i className="fas fa-save"></i>
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-100 h-64 flex items-center justify-center">
                  <div className="bg-white w-32 h-40 rounded-lg shadow-md relative border-2 border-gray-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-black transform -rotate-12">TEAM</span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 text-center">
                      <span className="text-xs text-black">23</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 p-3 flex space-x-2">
                  {['red', 'blue', 'green', 'black'].map((color) => (
                    <button 
                      key={color}
                      className={`w-8 h-8 bg-${color}-500 rounded border-2 border-gray-300 hover:border-black`}
                    />
                  ))}
                  <div className="border-l border-gray-300 mx-2"></div>
                  <Button size="sm" variant="secondary" className="text-xs">Text</Button>
                  <Button size="sm" variant="secondary" className="text-xs">Logo</Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Group Orders Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Team & Group Orders</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simplify team orders with our group ordering system. Perfect for schools, clubs, and organizations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Create Group",
                description: "Set up a group order with custom designs and size requirements."
              },
              {
                icon: ArrowRight,
                title: "Share Link",
                description: "Share the order link with team members to collect their preferences."
              },
              {
                icon: Check,
                title: "Complete Order",
                description: "Process the entire group order with quantity discounts applied."
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button 
              size="lg" 
              className="btn-primary"
              onClick={() => setLocation("/group-orders")}
            >
              Start Group Order
              <ShoppingBag className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Why Choose Strongwill Sports</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine premium quality with cutting-edge technology to deliver the best custom apparel experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Premium Quality",
                description: "High-grade materials and professional manufacturing ensure your apparel looks and performs at its best.",
                icon: "🏆"
              },
              {
                title: "Fast Turnaround",
                description: "Our streamlined process gets your custom apparel to you quickly without compromising quality.",
                icon: "⚡"
              },
              {
                title: "Design Freedom",
                description: "Complete creative control with our advanced design tools and unlimited customization options.",
                icon: "🎨"
              },
              {
                title: "Team Discounts",
                description: "Special pricing for bulk and group orders. The more you order, the more you save.",
                icon: "💰"
              },
              {
                title: "Expert Support",
                description: "Our design experts are here to help you create the perfect apparel for your team or event.",
                icon: "👥"
              },
              {
                title: "Global Shipping",
                description: "Fast, reliable shipping worldwide with tracking and insurance included on all orders.",
                icon: "🚚"
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 text-center card-hover">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSubscription />
        </div>
      </section>
    </div>
  );
}
