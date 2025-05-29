import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { ProductCategory } from "@shared/schema";
import { useLocation } from "wouter";
import { ArrowRight, Check, Users, Palette, ShoppingBag } from "lucide-react";
import { NewsletterSubscription } from "@/components/newsletter/newsletter-subscription";

export default function Home() {
  const [, setLocation] = useLocation();
  
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
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200"
            alt="Athletes in custom gear"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight">
            Design Your <span className="italic font-black">Perfect</span> Athletic Apparel
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Premium custom sports apparel with our advanced design tool. 
            Perfect for teams, clubs, and individual athletes who demand excellence.
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
              className="border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-4 text-lg"
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Our Product Range</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional-grade athletic apparel designed for peak performance and customization.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories?.map((category) => (
                <Card 
                  key={category.id} 
                  className="card-hover cursor-pointer overflow-hidden"
                  onClick={() => setLocation(`/products?category=${category.id}`)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={category.imageUrl || "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d"} 
                      alt={category.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-black mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <span className="text-sm font-medium text-black">View Collection</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Design Tool Preview */}
      <section className="py-20 bg-white">
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
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
          
          <div className="text-center mt-12">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSubscription />
        </div>
      </section>
    </div>
  );
}
