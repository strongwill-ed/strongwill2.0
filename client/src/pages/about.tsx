import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Award, Target, Users, Zap } from "lucide-react";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="italic"><span className="font-black">STRONGWILL</span><span className="font-normal">SPORTS</span></span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Where championship performance meets cutting-edge innovation. We craft premium athletic apparel 
              built to last generations, empowering athletes to create legacies that endure long after the final whistle.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Born from championship ambition, Strongwill Sports was founded by elite athletes who understood 
                  that excellence demands more than ordinary gear. When traditional suppliers failed to deliver 
                  the performance and innovation that champions require, we pioneered a new standard.
                </p>
                <p>
                  Our breakthrough design platform and revolutionary sponsorship marketplace don't just create 
                  apparel—they forge legacies. Every stitch is engineered for durability that outlasts careers, 
                  every design tells a story of dedication, and every sponsorship connection builds the foundation 
                  for athletic dreams.
                </p>
                <p>
                  From high school programs building tomorrow's champions to collegiate teams cementing their place 
                  in history, our premium materials and cutting-edge technology ensure that when athletes step onto 
                  the field, they carry not just superior performance gear, but the weight of legacy itself.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Athletes in custom gear" 
                className="rounded-lg shadow-lg w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="text-2xl font-bold text-black">5000+</div>
                <div className="text-sm text-gray-600">Happy Athletes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that separate champions from competitors—and why our premium investment delivers unmatched value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">Performance Excellence</h3>
                <p className="text-gray-600">
                  Championship-grade materials and precision engineering deliver performance that outlasts 
                  the competition. Built for athletes who demand nothing less than perfection.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">Cutting-Edge Innovation</h3>
                <p className="text-gray-600">
                  Our revolutionary design platform and sponsorship marketplace technology sets new industry 
                  standards. What others call impossible, we call Tuesday.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">Legacy Building</h3>
                <p className="text-gray-600">
                  From high school champions to collegiate legends, we craft gear that becomes part of 
                  athletic history. Your legacy deserves premium quality that endures.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">Built to Last</h3>
                <p className="text-gray-600">
                  Premium materials and meticulous craftsmanship ensure your investment withstands 
                  years of intense training and competition. Quality that justifies the premium.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Premium */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Premium?</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              When victory margins are measured in milliseconds and championships are won by dedication, 
              why settle for ordinary gear? Our premium investment delivers unmatched returns.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="border-l-4 border-white pl-6">
                <h3 className="text-xl font-semibold mb-3">Materials That Outlast Careers</h3>
                <p className="text-gray-300">
                  Our championship-grade fabrics withstand thousands of training hours and competitions. 
                  While competitors' gear fades and tears, yours maintains its performance and appearance season after season.
                </p>
              </div>
              
              <div className="border-l-4 border-white pl-6">
                <h3 className="text-xl font-semibold mb-3">Technology That Wins</h3>
                <p className="text-gray-300">
                  Our revolutionary design platform and sponsorship marketplace are industry firsts. 
                  Access tools and opportunities that simply don't exist elsewhere—innovation you can't find at any price.
                </p>
              </div>
              
              <div className="border-l-4 border-white pl-6">
                <h3 className="text-xl font-semibold mb-3">Legacy Investment</h3>
                <p className="text-gray-300">
                  High school and collegiate athletes create memories that last lifetimes. 
                  Premium gear becomes part of those championship stories, passed down and treasured for generations.
                </p>
              </div>
            </div>
            
            <div className="lg:text-right">
              <div className="inline-block bg-white text-black p-8 rounded-lg">
                <div className="text-4xl font-bold mb-2">3-5x</div>
                <div className="text-lg font-medium mb-4">Longer Lifespan</div>
                <p className="text-sm text-gray-600">
                  Premium materials cost more upfront but deliver superior value per wear, 
                  making them more economical over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Championship Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Elite athletes and industry veterans who understand what it takes to build gear worthy of champions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                alt="Team member" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover grayscale"
              />
              <h3 className="text-xl font-semibold text-black mb-2">Alex Rodriguez</h3>
              <p className="text-gray-600 mb-3">Founder & CEO</p>
              <p className="text-sm text-gray-600">
                Former Division I wrestler with 10+ years in athletic apparel design and manufacturing.
              </p>
            </div>

            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b72e69c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                alt="Team member" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover grayscale"
              />
              <h3 className="text-xl font-semibold text-black mb-2">Sarah Chen</h3>
              <p className="text-gray-600 mb-3">Head of Design</p>
              <p className="text-sm text-gray-600">
                Award-winning designer specializing in athletic wear with a passion for functional aesthetics.
              </p>
            </div>

            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                alt="Team member" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover grayscale"
              />
              <h3 className="text-xl font-semibold text-black mb-2">Mike Thompson</h3>
              <p className="text-gray-600 mb-3">VP of Operations</p>
              <p className="text-sm text-gray-600">
                Operations expert ensuring every order meets our high standards for quality and delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5000+</div>
              <div className="text-gray-300">Athletes Equipped</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-gray-300">Teams Served</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-gray-300">Product Types</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <div className="text-gray-300">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of athletes who trust Strongwill Sports for their custom apparel needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="btn-primary"
              onClick={() => setLocation("/design-tool")}
            >
              Start Designing
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="btn-secondary"
              onClick={() => setLocation("/contact")}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
